package org.example.shopflow.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.shopflow.auth.dto.request.MfaLoginRequest;
import org.example.shopflow.auth.dto.request.MfaRecoveryRequest;
import org.example.shopflow.auth.dto.request.MfaVerifyRequest;
import org.example.shopflow.auth.dto.response.AuthResponse;
import org.example.shopflow.auth.dto.response.MfaSetupResponse;
import org.example.shopflow.auth.security.UserPrincipal;
import org.example.shopflow.auth.service.AuthenticationService;
import org.example.shopflow.auth.service.MfaService;
import org.example.shopflow.shared.dto.response.ApiResponse;
import org.example.shopflow.shared.exception.BadRequestException;
import org.example.shopflow.shared.util.CookieUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/mfa")
@RequiredArgsConstructor
public class MfaController {

    private final MfaService mfaService;
    private final AuthenticationService authenticationService;
    private final CookieUtils cookieUtils;

    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<MfaSetupResponse>> setupMfa(
            @AuthenticationPrincipal UserPrincipal principal) {
        MfaSetupResponse setup = mfaService.setupMfa(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Scan the QR code with your authenticator app", setup));
    }

    @PostMapping("/verify-setup")
    public ResponseEntity<ApiResponse<MfaSetupResponse>> verifySetup(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String secret,
            @Valid @RequestBody MfaVerifyRequest request) {
        String effectiveSecret = request.getSecret();
        if (effectiveSecret == null || effectiveSecret.isBlank()) {
            effectiveSecret = secret;
        }
        if (effectiveSecret == null || effectiveSecret.isBlank()) {
            throw new BadRequestException("MFA secret is required for setup verification");
        }
        MfaSetupResponse result = mfaService.verifyAndEnableMfa(
                principal.getId(), effectiveSecret, request.getCode());
        return ResponseEntity.ok(ApiResponse.success(
                "MFA enabled successfully. Save your recovery codes securely — they will not be shown again.",
                result));
    }

    @PostMapping("/disable")
    public ResponseEntity<ApiResponse<Void>> disableMfa(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MfaVerifyRequest request) {
        mfaService.disableMfa(principal.getId(), request.getCode());
        return ResponseEntity.ok(ApiResponse.success("MFA has been disabled"));
    }

    @PostMapping("/recovery-codes/regenerate")
    public ResponseEntity<ApiResponse<List<String>>> regenerateRecoveryCodes(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MfaVerifyRequest request) {
        List<String> codes = mfaService.regenerateRecoveryCodes(principal.getId(), request.getCode());
        return ResponseEntity.ok(ApiResponse.success(
                "New recovery codes generated. Save them securely — old codes are now invalid.", codes));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyMfaLogin(
            @Valid @RequestBody MfaLoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        AuthenticationService.LoginResult result = authenticationService.completeMfaLogin(
                request.getMfaToken(), request.getCode(), httpRequest);

        if (result.refreshToken() != null) {
            Cookie refreshCookie = cookieUtils.createRefreshTokenCookie(result.refreshToken());
            httpResponse.addCookie(refreshCookie);
        }

        return ResponseEntity.ok(ApiResponse.success("MFA verification successful", result.authResponse()));
    }

    @PostMapping("/recovery")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyRecoveryCode(
            @Valid @RequestBody MfaRecoveryRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        AuthenticationService.LoginResult result = authenticationService.completeMfaLoginWithRecovery(
                request.getMfaToken(), request.getRecoveryCode(), httpRequest);

        if (result.refreshToken() != null) {
            Cookie refreshCookie = cookieUtils.createRefreshTokenCookie(result.refreshToken());
            httpResponse.addCookie(refreshCookie);
        }

        return ResponseEntity.ok(ApiResponse.success(
                "Recovery code accepted. Consider regenerating your recovery codes.", result.authResponse()));
    }
}
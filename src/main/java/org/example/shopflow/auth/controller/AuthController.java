package org.example.shopflow.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.shopflow.auth.dto.request.ForgotPasswordRequest;
import org.example.shopflow.auth.dto.request.LoginRequest;
import org.example.shopflow.auth.dto.request.RegisterRequest;
import org.example.shopflow.auth.dto.request.ResetPasswordRequest;
import org.example.shopflow.auth.dto.response.AuthResponse;
import org.example.shopflow.auth.security.JwtService;
import org.example.shopflow.auth.security.UserPrincipal;
import org.example.shopflow.auth.service.AuthenticationService;
import org.example.shopflow.auth.service.TokenBlacklistService;
import org.example.shopflow.shared.dto.response.ApiResponse;
import org.example.shopflow.shared.exception.TokenException;
import org.example.shopflow.shared.util.CookieUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final CookieUtils cookieUtils;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authenticationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful. Please check your email to verify your account."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        AuthenticationService.LoginResult result = authenticationService.login(request, httpRequest);

        if (result.refreshToken() != null) {
            Cookie refreshCookie = cookieUtils.createRefreshTokenCookie(result.refreshToken());
            httpResponse.addCookie(refreshCookie);
        }

        String message = Boolean.TRUE.equals(result.authResponse().getMfaRequired())
                ? "MFA verification required"
                : "Login successful";
        return ResponseEntity.ok(ApiResponse.success(message, result.authResponse()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        String rawRefreshToken = cookieUtils.getRefreshTokenFromCookies(request)
                .orElseThrow(() -> new TokenException("Refresh token not found"));

        AuthenticationService.RefreshResult result =
                authenticationService.refreshAccessToken(rawRefreshToken, request);

        Cookie refreshCookie = cookieUtils.createRefreshTokenCookie(result.newRefreshToken());
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(ApiResponse.success("Token refreshed", result.authResponse()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        blacklistAccessToken(request);

        cookieUtils.getRefreshTokenFromCookies(request)
                .ifPresent(authenticationService::logout);

        response.addCookie(cookieUtils.createExpiredRefreshTokenCookie());

        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Void>> logoutAll(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request,
            HttpServletResponse response) {

        blacklistAccessToken(request);

        authenticationService.logoutAll(principal.getId());

        response.addCookie(cookieUtils.createExpiredRefreshTokenCookie());

        return ResponseEntity.ok(ApiResponse.success("All sessions have been terminated"));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        authenticationService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully. You can now login."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestParam String email) {
        authenticationService.resendVerificationEmail(email);
        return ResponseEntity.ok(ApiResponse.success("Verification email sent. Please check your inbox."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(
                "If an account with that email exists, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully. Please login with your new password."));
    }

    private void blacklistAccessToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            try {
                String jti = jwtService.getJtiFromToken(jwt);
                long remainingMs = jwtService.getRemainingMs(jwt);
                tokenBlacklistService.blacklist(jti, remainingMs);
            } catch (Exception e) {
                // Token may be invalid/expired — no need to blacklist
            }
        }
    }
}
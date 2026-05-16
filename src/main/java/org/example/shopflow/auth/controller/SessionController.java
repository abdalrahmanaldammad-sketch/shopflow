package org.example.shopflow.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.shopflow.auth.dto.response.SessionResponse;
import org.example.shopflow.auth.security.UserPrincipal;
import org.example.shopflow.auth.service.SessionService;
import org.example.shopflow.shared.dto.response.ApiResponse;
import org.example.shopflow.shared.util.CookieUtils;
import org.example.shopflow.shared.util.TokenUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final CookieUtils cookieUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getActiveSessions(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {

        String currentTokenHash = cookieUtils.getRefreshTokenFromCookies(request)
                .map(TokenUtils::hashToken)
                .orElse(null);

        List<SessionResponse> sessions = sessionService.getActiveSessions(principal.getId(), currentTokenHash);
        return ResponseEntity.ok(ApiResponse.success("Active sessions retrieved", sessions));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> revokeSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserPrincipal principal) {

        sessionService.revokeSession(sessionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Session revoked successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> revokeAllSessions(
            @AuthenticationPrincipal UserPrincipal principal) {
        sessionService.revokeAllSessions(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("All sessions revoked successfully"));
    }
}
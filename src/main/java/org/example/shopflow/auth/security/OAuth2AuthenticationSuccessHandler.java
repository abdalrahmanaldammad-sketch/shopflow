package org.example.shopflow.auth.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.auth.service.SessionService;
import org.example.shopflow.shared.util.CookieUtils;
import org.example.shopflow.user.entity.User;
import org.example.shopflow.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final SessionService sessionService;
    private final CookieUtils cookieUtils;
    private final UserRepository userRepository;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId()).orElse(null);

        if (user != null && user.isMfaEnabled()) {
            String mfaToken = jwtService.generateMfaToken(principal.getId(), principal.getEmail());

            String targetUrl = UriComponentsBuilder.fromUriString(redirectUri).build().toUriString();
            targetUrl = targetUrl + "#mfa_required=true&mfa_token=" + mfaToken;

            log.info("OAuth2 login requires MFA for user: {}", principal.getEmail());
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
            return;
        }

        String accessToken = jwtService.generateAccessToken(principal.getId(), principal.getEmail());
        String refreshToken = sessionService.createSession(principal.getId(), request);

        Cookie refreshCookie = cookieUtils.createRefreshTokenCookie(refreshToken);
        response.addCookie(refreshCookie);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri).build().toUriString();
        targetUrl = targetUrl + "#token=" + accessToken;

        log.info("OAuth2 login successful for user: {}", principal.getEmail());
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
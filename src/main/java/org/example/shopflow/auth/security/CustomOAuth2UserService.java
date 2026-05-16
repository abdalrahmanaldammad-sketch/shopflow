package org.example.shopflow.auth.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.shared.exception.OAuth2AuthenticationProcessingException;
import org.example.shopflow.user.entity.Role;
import org.example.shopflow.user.entity.User;
import org.example.shopflow.user.entity.enums.AuthProvider;
import org.example.shopflow.user.entity.enums.RoleName;
import org.example.shopflow.user.repository.RoleRepository;
import org.example.shopflow.user.repository.UserRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());

        String email = extractEmail(oAuth2User, provider, userRequest);
        String providerId = extractProviderId(oAuth2User, provider);
        String firstName = extractFirstName(oAuth2User, provider);
        String lastName = extractLastName(oAuth2User, provider);

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationProcessingException(
                    "Email not found from " + provider + " provider. Please ensure your email is public.");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            if (user.getAuthProvider() == AuthProvider.LOCAL) {
                user.setAuthProvider(provider);
                user.setProviderId(providerId);
                user.setEmailVerified(true);
                userRepository.save(user);
                log.info("Linked {} account to existing local user: {}", provider, email);
            } else if (user.getAuthProvider() != provider) {
                throw new OAuth2AuthenticationProcessingException(
                        "This email is already linked to a different provider.");
            }
        } else {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new OAuth2AuthenticationProcessingException("Default role not found"));

            user = User.builder()
                    .email(email)
                    .firstName(firstName != null ? firstName : "")
                    .lastName(lastName != null ? lastName : "")
                    .authProvider(provider)
                    .providerId(providerId)
                    .emailVerified(true)
                    .enabled(true)
                    .roles(Set.of(userRole))
                    .build();
            user = userRepository.save(user);
            log.info("Created new user from {} OAuth2: {}", provider, email);
        }

        return UserPrincipal.fromUser(user, oAuth2User.getAttributes());
    }

    private String extractEmail(OAuth2User oAuth2User, AuthProvider provider, OAuth2UserRequest userRequest) {
        return switch (provider) {
            case GOOGLE -> {
                Boolean verified = oAuth2User.getAttribute("email_verified");
                if (!Boolean.TRUE.equals(verified)) {
                    yield null;
                }
                yield oAuth2User.getAttribute("email");
            }
            case GITHUB -> {
                String email = oAuth2User.getAttribute("email");
                if (email == null || email.isBlank()) {
                    email = fetchGitHubPrimaryEmail(userRequest.getAccessToken().getTokenValue());
                }
                yield email;
            }
            default -> null;
        };
    }

    private String fetchGitHubPrimaryEmail(String accessToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            org.springframework.http.HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    new org.springframework.http.HttpEntity<>(headers),
                    new ParameterizedTypeReference<>() {}
            );

            if (response.getBody() != null) {
                for (Map<String, Object> emailObj : response.getBody()) {
                    Boolean primary = (Boolean) emailObj.get("primary");
                    Boolean verified = (Boolean) emailObj.get("verified");
                    if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified)) {
                        return (String) emailObj.get("email");
                    }
                }
                for (Map<String, Object> emailObj : response.getBody()) {
                    Boolean verified = (Boolean) emailObj.get("verified");
                    if (Boolean.TRUE.equals(verified)) {
                        return (String) emailObj.get("email");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch GitHub email: {}", e.getMessage());
        }
        return null;
    }

    private String extractProviderId(OAuth2User oAuth2User, AuthProvider provider) {
        return switch (provider) {
            case GOOGLE -> oAuth2User.getAttribute("sub");
            case GITHUB -> {
                Object id = oAuth2User.getAttribute("id");
                yield id != null ? id.toString() : null;
            }
            default -> null;
        };
    }

    private String extractFirstName(OAuth2User oAuth2User, AuthProvider provider) {
        return switch (provider) {
            case GOOGLE -> oAuth2User.getAttribute("given_name");
            case GITHUB -> {
                String name = oAuth2User.getAttribute("name");
                String login = oAuth2User.getAttribute("login");
                if (name != null && name.contains(" ")) {
                    yield name.split(" ")[0];
                }
                yield name != null ? name : login;
            }
            default -> null;
        };
    }

    private String extractLastName(OAuth2User oAuth2User, AuthProvider provider) {
        return switch (provider) {
            case GOOGLE -> oAuth2User.getAttribute("family_name");
            case GITHUB -> {
                String name = oAuth2User.getAttribute("name");
                yield name != null && name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : "";
            }
            default -> null;
        };
    }
}
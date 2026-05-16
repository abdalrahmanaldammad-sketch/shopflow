package org.example.shopflow.auth.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.example.shopflow.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@Builder
public class UserPrincipal implements UserDetails, OAuth2User {

    private final UUID id;
    private final String email;
    private final String password;
    private final boolean emailVerified;
    private final boolean enabled;
    private final boolean accountLocked;
    private final Collection<? extends GrantedAuthority> authorities;
    private Map<String, Object> attributes;

    public static UserPrincipal fromUser(User user) {
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toSet());

        return UserPrincipal.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .emailVerified(user.isEmailVerified())
                .enabled(user.isEnabled())
                .accountLocked(user.isAccountLocked())
                .authorities(authorities)
                .build();
    }

    public static UserPrincipal fromUser(User user, Map<String, Object> attributes) {
        UserPrincipal principal = fromUser(user);
        principal.attributes = attributes;
        return principal;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String getName() {
        return String.valueOf(id);
    }
}
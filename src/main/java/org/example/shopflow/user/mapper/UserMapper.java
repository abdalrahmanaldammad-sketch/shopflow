package org.example.shopflow.user.mapper;

import org.example.shopflow.user.dto.response.UserResponse;
import org.example.shopflow.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        Set<String> roles = user.getRoles() == null
                ? Set.of()
                : user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .emailVerified(user.isEmailVerified())
                .mfaEnabled(user.isMfaEnabled())
                .authProvider(user.getAuthProvider().name())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
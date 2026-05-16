package org.example.shopflow.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {

    private UUID id;
    private String ipAddress;
    private String browser;
    private String operatingSystem;
    private String deviceType;
    private Instant createdAt;
    private Instant lastUsedAt;
    private Instant expiresAt;
    private boolean current;
}
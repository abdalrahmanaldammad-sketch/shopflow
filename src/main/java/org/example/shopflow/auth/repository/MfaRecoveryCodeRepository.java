package org.example.shopflow.auth.repository;

import org.example.shopflow.auth.entity.MfaRecoveryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MfaRecoveryCodeRepository extends JpaRepository<MfaRecoveryCode, UUID> {

    List<MfaRecoveryCode> findAllByUserIdAndUsedFalse(UUID userId);

    @Modifying
    @Query("DELETE FROM MfaRecoveryCode m WHERE m.user.id = :userId")
    void deleteAllByUserId(UUID userId);
}
package com.redweb.backend.repository;

import com.redweb.backend.model.HealthRecord;
import com.redweb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    Optional<HealthRecord> findByUser(User user);
    List<HealthRecord> findByNextEligibleDateBefore(LocalDate date);
    List<HealthRecord> findByNextEligibleDateBeforeAndUser_Role(LocalDate date, User.UserRole role);
}

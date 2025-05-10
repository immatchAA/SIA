package com.redweb.backend.repository;

import com.redweb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(User.UserRole role);
    List<User> findByBloodType(String bloodType);
    
    @Query("SELECT u FROM User u WHERE u.emergencyOptIn = :optIn AND u.role = :role")
    List<User> findByEmergencyOptInAndRole(@Param("optIn") boolean emergencyOptIn, @Param("role") User.UserRole role);
}

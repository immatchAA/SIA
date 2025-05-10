package com.redweb.backend.repository;

import com.redweb.backend.model.Badge;
import com.redweb.backend.model.User;
import com.redweb.backend.model.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUser(User user);
    List<UserBadge> findByBadge(Badge badge);
    boolean existsByUserAndBadge(User user, Badge badge);
    Optional<UserBadge> findByUserAndBadge(User user, Badge badge);
}

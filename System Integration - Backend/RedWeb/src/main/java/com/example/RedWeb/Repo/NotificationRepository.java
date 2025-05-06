package com.example.RedWeb.Repo;

import com.example.RedWeb.Entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findAllByOrderByCreatedAtDesc();
}
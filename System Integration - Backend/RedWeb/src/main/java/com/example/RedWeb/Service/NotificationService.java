package com.example.RedWeb.Service;

import com.example.RedWeb.Entity.NotificationEntity;
import com.example.RedWeb.Repo.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void save(String title, String message) {
        NotificationEntity notification = new NotificationEntity();
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public List<NotificationEntity> getAll() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }
}
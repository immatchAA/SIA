package com.example.RedWeb.Controller;

import com.example.RedWeb.Entity.NotificationEntity;
import com.example.RedWeb.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<NotificationEntity> getAll() {
        return notificationService.getAll();
    }
}
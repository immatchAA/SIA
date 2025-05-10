package com.redweb.backend.controller;

import com.redweb.backend.model.Badge;
import com.redweb.backend.model.UserBadge;
import com.redweb.backend.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @GetMapping
    public List<Badge> getAllBadges() {
        return badgeService.getAllBadges();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Badge> getBadgeById(@PathVariable Long id) {
        return ResponseEntity.ok(badgeService.getBadgeById(id));
    }

    @GetMapping("/points/{points}")
    public List<Badge> getBadgesByPointsThreshold(@PathVariable int points) {
        return badgeService.getBadgesByPointsThreshold(points);
    }

    @GetMapping("/user/{userId}")
    public List<UserBadge> getUserBadges(@PathVariable Long userId) {
        return badgeService.getUserBadges(userId);
    }

    @GetMapping("/badge/{badgeId}/users")
    public List<UserBadge> getUsersByBadge(@PathVariable Long badgeId) {
        return badgeService.getUsersByBadge(badgeId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Badge> createBadge(@RequestBody Badge badge) {
        return new ResponseEntity<>(badgeService.createBadge(badge), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Badge> updateBadge(@PathVariable Long id, @RequestBody Badge badgeDetails) {
        return ResponseEntity.ok(badgeService.updateBadge(id, badgeDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBadge(@PathVariable Long id) {
        badgeService.deleteBadge(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/award/{userId}/{badgeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserBadge> awardBadgeToUser(
            @PathVariable Long userId, 
            @PathVariable Long badgeId) {
        return new ResponseEntity<>(
                badgeService.awardBadgeToUser(userId, badgeId), 
                HttpStatus.CREATED);
    }

    @PostMapping("/check-and-award/{userId}")
    public ResponseEntity<?> checkAndAwardBadges(@PathVariable Long userId) {
        badgeService.checkAndAwardBadges(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Badges checked and awarded if eligible");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/revoke/{userId}/{badgeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeBadgeFromUser(
            @PathVariable Long userId, 
            @PathVariable Long badgeId) {
        badgeService.removeBadgeFromUser(userId, badgeId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("revoked", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}

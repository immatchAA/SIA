package com.redweb.backend.service;

import com.redweb.backend.model.Badge;
import com.redweb.backend.model.User;
import com.redweb.backend.model.UserBadge;
import com.redweb.backend.repository.BadgeRepository;
import com.redweb.backend.repository.UserBadgeRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    public Badge getBadgeById(Long id) {
        return badgeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Badge not found with id: " + id));
    }

    public Badge createBadge(Badge badge) {
        badge.setCreatedAt(LocalDateTime.now());
        return badgeRepository.save(badge);
    }

    public Badge updateBadge(Long id, Badge badgeDetails) {
        Badge badge = getBadgeById(id);
        
        badge.setTitle(badgeDetails.getTitle());
        badge.setDescription(badgeDetails.getDescription());
        badge.setPointsRequired(badgeDetails.getPointsRequired());
        
        return badgeRepository.save(badge);
    }

    public void deleteBadge(Long id) {
        badgeRepository.deleteById(id);
    }

    public List<Badge> getBadgesByPointsThreshold(int points) {
        return badgeRepository.findByPointsRequiredLessThanEqual(points);
    }

    public List<UserBadge> getUserBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        return userBadgeRepository.findByUser(user);
    }

    public List<UserBadge> getUsersByBadge(Long badgeId) {
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found with id: " + badgeId));
        
        return userBadgeRepository.findByBadge(badge);
    }

    @Transactional
    public UserBadge awardBadgeToUser(Long userId, Long badgeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found with id: " + badgeId));
        
        // Check if user already has this badge
        if (userBadgeRepository.existsByUserAndBadge(user, badge)) {
            throw new RuntimeException("User already has this badge");
        }
        
        // Check if user has enough points for this badge
        int userPoints = Integer.parseInt(user.getPoints());
        if (userPoints < badge.getPointsRequired()) {
            throw new RuntimeException("User does not have enough points for this badge");
        }
        
        UserBadge userBadge = new UserBadge();
        userBadge.setUser(user);
        userBadge.setBadge(badge);
        
        return userBadgeRepository.save(userBadge);
    }

    @Transactional
    public void checkAndAwardBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        int userPoints = Integer.parseInt(user.getPoints());
        
        // Get all badges that the user qualifies for based on points
        List<Badge> eligibleBadges = badgeRepository.findByPointsRequiredLessThanEqual(userPoints);
        
        for (Badge badge : eligibleBadges) {
            // Only award if user doesn't already have this badge
            if (!userBadgeRepository.existsByUserAndBadge(user, badge)) {
                UserBadge userBadge = new UserBadge();
                userBadge.setUser(user);
                userBadge.setBadge(badge);
                userBadgeRepository.save(userBadge);
            }
        }
    }

    public void removeBadgeFromUser(Long userId, Long badgeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found with id: " + badgeId));
        
        UserBadge userBadge = userBadgeRepository.findByUserAndBadge(user, badge)
                .orElseThrow(() -> new RuntimeException("User does not have this badge"));
        
        userBadgeRepository.delete(userBadge);
    }
}

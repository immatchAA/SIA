package com.redweb.backend.service;

import com.redweb.backend.model.User;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }

    public List<User> getDonorsForEmergency(String bloodType) {
        return userRepository.findByEmergencyOptInAndRole(true, User.UserRole.DONOR)
                .stream()
                .filter(user -> isCompatibleBloodType(user.getBloodType(), bloodType))
                .toList();
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setLatitude(userDetails.getLatitude());
        user.setLongitude(userDetails.getLongitude());
        user.setEmergencyOptIn(userDetails.isEmergencyOptIn());
        
        // Only update password if it's provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean addUserPoints(Long userId, int points) {
        User user = getUserById(userId);
        int currentPoints = Integer.parseInt(user.getPoints());
        int newPoints = currentPoints + points;
        user.setPoints(String.valueOf(newPoints));
        userRepository.save(user);
        return true;
    }

    // Helper method to check blood type compatibility
    private boolean isCompatibleBloodType(String donorType, String recipientType) {
        // Basic blood type compatibility rules
        // O- can donate to anyone
        if (donorType.equals("O-")) return true;
        
        // O+ can donate to A+, B+, AB+, O+
        if (donorType.equals("O+")) {
            return recipientType.equals("A+") || recipientType.equals("B+") || 
                   recipientType.equals("AB+") || recipientType.equals("O+");
        }
        
        // A- can donate to A+, A-, AB+, AB-
        if (donorType.equals("A-")) {
            return recipientType.equals("A+") || recipientType.equals("A-") || 
                   recipientType.equals("AB+") || recipientType.equals("AB-");
        }
        
        // A+ can donate to A+, AB+
        if (donorType.equals("A+")) {
            return recipientType.equals("A+") || recipientType.equals("AB+");
        }
        
        // B- can donate to B+, B-, AB+, AB-
        if (donorType.equals("B-")) {
            return recipientType.equals("B+") || recipientType.equals("B-") || 
                   recipientType.equals("AB+") || recipientType.equals("AB-");
        }
        
        // B+ can donate to B+, AB+
        if (donorType.equals("B+")) {
            return recipientType.equals("B+") || recipientType.equals("AB+");
        }
        
        // AB- can donate to AB+, AB-
        if (donorType.equals("AB-")) {
            return recipientType.equals("AB+") || recipientType.equals("AB-");
        }
        
        // AB+ can only donate to AB+
        if (donorType.equals("AB+")) {
            return recipientType.equals("AB+");
        }
        
        return false;
    }
}

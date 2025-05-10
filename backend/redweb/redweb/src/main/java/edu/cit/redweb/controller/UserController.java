package edu.cit.redweb.controller;

import edu.cit.redweb.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        // In a real app, you would fetch this from a database
        User user = new User();
        user.setId(userId);
        user.setEmail("user" + userId + "@redweb.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setBloodType("A+");
        user.setRole("DONOR");
        
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestBody User updatedUser) {
        // In a real app, you would update the user in the database
        // For now, just echo back the updated user
        updatedUser.setId(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Profile updated successfully");
        response.put("user", updatedUser);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{userId}/eligibility")
    public ResponseEntity<?> checkDonationEligibility(@PathVariable Long userId) {
        // In a real app, you would check various factors like last donation date, health status, etc.
        Map<String, Object> response = new HashMap<>();
        response.put("eligible", true);
        response.put("nextEligibleDate", null);
        response.put("reason", "You are eligible to donate blood");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/donors")
    public ResponseEntity<?> getAllDonors() {
        // In a real app, this would come from a database query
        List<User> donors = new ArrayList<>();
        
        for (int i = 1; i <= 5; i++) {
            User donor = new User();
            donor.setId((long) i);
            donor.setEmail("donor" + i + "@redweb.com");
            donor.setFirstName("Donor");
            donor.setLastName("" + i);
            donor.setBloodType(getRandomBloodType(i));
            donor.setRole("DONOR");
            donors.add(donor);
        }
        
        return ResponseEntity.ok(donors);
    }
    
    private String getRandomBloodType(int seed) {
        String[] bloodTypes = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        return bloodTypes[seed % bloodTypes.length];
    }
}

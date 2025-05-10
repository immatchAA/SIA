package com.redweb.backend.controller;

import com.redweb.backend.model.User;
import com.redweb.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/donors")
    public List<User> getAllDonors() {
        return userService.getUsersByRole(User.UserRole.DONOR);
    }

    @GetMapping("/patients")
    public List<User> getAllPatients() {
        return userService.getUsersByRole(User.UserRole.PATIENT);
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/points")
    public ResponseEntity<?> addPoints(@PathVariable Long id, @RequestParam int points) {
        boolean updated = userService.addUserPoints(id, points);
        Map<String, Boolean> response = new HashMap<>();
        response.put("updated", updated);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/emergency-donors")
    public List<User> getEmergencyDonors(@RequestParam String bloodType) {
        return userService.getDonorsForEmergency(bloodType);
    }
}

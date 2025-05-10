package edu.cit.redweb.controller;

import edu.cit.redweb.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        // In a real application, you would validate against a database
        // This is a simplified example with hardcoded values
        if (email != null && email.equals("test@redweb.com") && password != null && password.equals("password")) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("accessToken", "mock-jwt-token-" + System.currentTimeMillis());
            response.put("userId", 1);
            response.put("email", email);
            response.put("role", "DONOR");
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(error);
        }
    }

    @PostMapping("/register/donor")
    public ResponseEntity<?> registerDonor(@RequestBody User user) {
        // This would normally save to a database
        // For now, we'll just return a success response
        user.setId(Long.valueOf(System.currentTimeMillis()));
        user.setRole("DONOR");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Donor registered successfully");
        response.put("userId", user.getId());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@RequestBody User user) {
        // This would normally save to a database
        // For now, we'll just return a success response
        user.setId(Long.valueOf(System.currentTimeMillis()));
        user.setRole("PATIENT");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Patient registered successfully");
        response.put("userId", user.getId());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        // In a real app, you would validate the JWT token here
        // For this example, we'll accept any non-null authorization header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            return ResponseEntity.status(401).body(response);
        }
    }
}

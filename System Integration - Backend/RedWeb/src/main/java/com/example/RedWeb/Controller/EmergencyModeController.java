package com.example.RedWeb.Controller;

import com.example.RedWeb.Service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyModeController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping("/activate")
    public ResponseEntity<String> activateEmergencyMode(@RequestBody String bloodRequestId) {
        // Handle activating emergency mode for a specific blood request
        try {
            bloodRequestService.activateEmergencyMode(bloodRequestId);
            return ResponseEntity.ok("Emergency mode activated for request ID: " + bloodRequestId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to activate emergency mode for request ID: " + bloodRequestId
                    + ". Error: " + e.getMessage());
        }
    }
}

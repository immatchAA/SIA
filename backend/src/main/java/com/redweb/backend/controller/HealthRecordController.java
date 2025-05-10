package com.redweb.backend.controller;

import com.redweb.backend.model.HealthRecord;
import com.redweb.backend.service.HealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordService.getAllHealthRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthRecord> getHealthRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(healthRecordService.getHealthRecordById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<HealthRecord> getHealthRecordByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(healthRecordService.getHealthRecordByUserId(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<HealthRecord> createHealthRecord(
            @PathVariable Long userId, 
            @RequestBody HealthRecord healthRecord) {
        return new ResponseEntity<>(
                healthRecordService.createHealthRecord(userId, healthRecord), 
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthRecord> updateHealthRecord(
            @PathVariable Long id, 
            @RequestBody HealthRecord healthRecordDetails) {
        return ResponseEntity.ok(
                healthRecordService.updateHealthRecord(id, healthRecordDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteHealthRecord(@PathVariable Long id) {
        healthRecordService.deleteHealthRecord(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{userId}/last-donation")
    public ResponseEntity<HealthRecord> updateLastDonation(
            @PathVariable Long userId,
            @RequestParam String donationDate) {
        LocalDate date = LocalDate.parse(donationDate);
        return ResponseEntity.ok(healthRecordService.updateLastDonation(userId, date));
    }

    @GetMapping("/eligible-donors")
    public List<HealthRecord> getEligibleDonors() {
        return healthRecordService.getEligibleDonors();
    }
}

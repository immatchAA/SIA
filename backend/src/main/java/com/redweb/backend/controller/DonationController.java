package com.redweb.backend.controller;

import com.redweb.backend.model.Donation;
import com.redweb.backend.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @GetMapping
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    @GetMapping("/donor/{donorId}")
    public List<Donation> getDonationsByDonor(@PathVariable Long donorId) {
        return donationService.getDonationsByDonor(donorId);
    }

    @GetMapping("/drive/{driveId}")
    public List<Donation> getDonationsByDrive(@PathVariable Long driveId) {
        return donationService.getDonationsByDrive(driveId);
    }

    @GetMapping("/emergency-request/{requestId}")
    public List<Donation> getDonationsByEmergencyRequest(@PathVariable Long requestId) {
        return donationService.getDonationsByEmergencyRequest(requestId);
    }

    @GetMapping("/status/{status}")
    public List<Donation> getDonationsByStatus(@PathVariable String status) {
        Donation.DonationStatus donationStatus = Donation.DonationStatus.valueOf(status);
        return donationService.getDonationsByStatus(donationStatus);
    }

    @GetMapping("/blood-type/{bloodType}")
    public List<Donation> getDonationsByBloodType(@PathVariable String bloodType) {
        return donationService.getDonationsByBloodType(bloodType);
    }

    @PostMapping("/drive/{donorId}/{driveId}")
    public ResponseEntity<Donation> createDriveDonation(
            @PathVariable Long donorId,
            @PathVariable Long driveId,
            @RequestBody Donation donation) {
        return new ResponseEntity<>(
                donationService.createDriveDonation(donorId, driveId, donation),
                HttpStatus.CREATED);
    }

    @PostMapping("/emergency/{donorId}/{requestId}")
    public ResponseEntity<Donation> createEmergencyDonation(
            @PathVariable Long donorId,
            @PathVariable Long requestId,
            @RequestBody Donation donation) {
        return new ResponseEntity<>(
                donationService.createEmergencyDonation(donorId, requestId, donation),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donation> updateDonation(
            @PathVariable Long id,
            @RequestBody Donation donationDetails) {
        return ResponseEntity.ok(donationService.updateDonation(id, donationDetails));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Donation> updateDonationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Donation.DonationStatus donationStatus = Donation.DonationStatus.valueOf(status);
        return ResponseEntity.ok(donationService.updateDonationStatus(id, donationStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonation(@PathVariable Long id) {
        donationService.deleteDonation(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}

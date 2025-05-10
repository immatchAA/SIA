package com.redweb.backend.controller;

import com.redweb.backend.model.DonationDrive;
import com.redweb.backend.service.DonationDriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donation-drives")
public class DonationDriveController {

    @Autowired
    private DonationDriveService donationDriveService;

    @GetMapping
    public List<DonationDrive> getAllDonationDrives() {
        return donationDriveService.getAllDonationDrives();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationDrive> getDonationDriveById(@PathVariable Long id) {
        return ResponseEntity.ok(donationDriveService.getDonationDriveById(id));
    }

    @GetMapping("/organizer/{organizerId}")
    public List<DonationDrive> getDonationDrivesByOrganizer(@PathVariable Long organizerId) {
        return donationDriveService.getDonationDrivesByOrganizer(organizerId);
    }

    @GetMapping("/active")
    public List<DonationDrive> getActiveDonationDrives() {
        return donationDriveService.getActiveDonationDrives();
    }

    @GetMapping("/upcoming")
    public List<DonationDrive> getUpcomingDonationDrives() {
        return donationDriveService.getUpcomingDonationDrives();
    }

    @GetMapping("/blood-type/{bloodType}")
    public List<DonationDrive> getDonationDrivesByBloodType(@PathVariable String bloodType) {
        return donationDriveService.getDonationDrivesByBloodType(bloodType);
    }

    @PostMapping("/organizer/{organizerId}")
    public ResponseEntity<DonationDrive> createDonationDrive(
            @PathVariable Long organizerId,
            @RequestBody DonationDrive donationDrive) {
        return new ResponseEntity<>(
                donationDriveService.createDonationDrive(organizerId, donationDrive),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationDrive> updateDonationDrive(
            @PathVariable Long id,
            @RequestBody DonationDrive donationDriveDetails) {
        return ResponseEntity.ok(donationDriveService.updateDonationDrive(id, donationDriveDetails));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DonationDrive> updateDonationDriveStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        DonationDrive.DriveStatus driveStatus = DonationDrive.DriveStatus.valueOf(status);
        return ResponseEntity.ok(donationDriveService.updateDonationDriveStatus(id, driveStatus));
    }

    @PutMapping("/{id}/increment-donors")
    public ResponseEntity<DonationDrive> incrementCurrentDonors(@PathVariable Long id) {
        return ResponseEntity.ok(donationDriveService.incrementCurrentDonors(id));
    }

    @PutMapping("/{id}/decrement-donors")
    public ResponseEntity<DonationDrive> decrementCurrentDonors(@PathVariable Long id) {
        return ResponseEntity.ok(donationDriveService.decrementCurrentDonors(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonationDrive(@PathVariable Long id) {
        donationDriveService.deleteDonationDrive(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}

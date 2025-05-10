package com.redweb.backend.service;

import com.redweb.backend.model.Donation;
import com.redweb.backend.model.DonationDrive;
import com.redweb.backend.model.EmergencyRequest;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.DonationDriveRepository;
import com.redweb.backend.repository.DonationRepository;
import com.redweb.backend.repository.EmergencyRequestRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationDriveRepository donationDriveRepository;

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @Autowired
    private HealthRecordService healthRecordService;

    @Autowired
    private UserService userService;

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Donation getDonationById(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + id));
    }

    public List<Donation> getDonationsByDonor(Long donorId) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + donorId));
        
        return donationRepository.findByDonor(donor);
    }

    public List<Donation> getDonationsByDrive(Long driveId) {
        DonationDrive drive = donationDriveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Donation drive not found with id: " + driveId));
        
        return donationRepository.findByDrive(drive);
    }

    public List<Donation> getDonationsByEmergencyRequest(Long requestId) {
        EmergencyRequest request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found with id: " + requestId));
        
        return donationRepository.findByEmergencyRequest(request);
    }

    @Transactional
    public Donation createDriveDonation(Long donorId, Long driveId, Donation donation) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + donorId));
        
        DonationDrive drive = donationDriveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Donation drive not found with id: " + driveId));
        
        // Check if drive is active
        if (drive.getStatus() != DonationDrive.DriveStatus.ACTIVE) {
            throw new RuntimeException("Donation drive is not active");
        }
        
        // Check if drive has reached capacity
        if (drive.getCurrentDonors() >= drive.getMaxCapacity()) {
            throw new RuntimeException("Donation drive has reached its maximum capacity");
        }
        
        donation.setDonor(donor);
        donation.setDrive(drive);
        donation.setEmergencyRequest(null);
        
        if (donation.getDonationDate() == null) {
            donation.setDonationDate(LocalDateTime.now());
        }
        
        donation.setCreatedAt(LocalDateTime.now());
        donation.setUpdatedAt(LocalDateTime.now());
        
        // Set initial status if not provided
        if (donation.getStatus() == null) {
            donation.setStatus(Donation.DonationStatus.COMPLETED);
        }
        
        // Increment current donors in the drive
        drive.setCurrentDonors(drive.getCurrentDonors() + 1);
        donationDriveRepository.save(drive);
        
        // Update health record with last donation date
        healthRecordService.updateLastDonation(donorId, donation.getDonationDate().toLocalDate());
        
        // Award points to donor
        int pointsToAward = 100; // Base points for a donation
        userService.addUserPoints(donorId, pointsToAward);
        
        return donationRepository.save(donation);
    }

    @Transactional
    public Donation createEmergencyDonation(Long donorId, Long requestId, Donation donation) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + donorId));
        
        EmergencyRequest request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found with id: " + requestId));
        
        // Check if request is active
        if (request.getStatus() != EmergencyRequest.RequestStatus.ACTIVE) {
            throw new RuntimeException("Emergency request is not active");
        }
        
        donation.setDonor(donor);
        donation.setDrive(null);
        donation.setEmergencyRequest(request);
        
        if (donation.getDonationDate() == null) {
            donation.setDonationDate(LocalDateTime.now());
        }
        
        donation.setCreatedAt(LocalDateTime.now());
        donation.setUpdatedAt(LocalDateTime.now());
        
        // Set initial status if not provided
        if (donation.getStatus() == null) {
            donation.setStatus(Donation.DonationStatus.COMPLETED);
        }
        
        // Check if this fulfills the emergency request
        List<Donation> existingDonations = donationRepository.findByEmergencyRequest(request);
        double totalUnitsDonated = existingDonations.stream()
                .mapToDouble(Donation::getUnits)
                .sum() + donation.getUnits();
        
        if (totalUnitsDonated >= request.getUnitsNeeded()) {
            request.setStatus(EmergencyRequest.RequestStatus.FULFILLED);
            emergencyRequestRepository.save(request);
        }
        
        // Update health record with last donation date
        healthRecordService.updateLastDonation(donorId, donation.getDonationDate().toLocalDate());
        
        // Award points to donor - emergency donations get more points
        int urgencyBonus = getUrgencyBonus(request.getUrgencyLevel());
        int pointsToAward = 150 + urgencyBonus; // Base points for emergency + urgency bonus
        userService.addUserPoints(donorId, pointsToAward);
        
        return donationRepository.save(donation);
    }
    
    private int getUrgencyBonus(EmergencyRequest.UrgencyLevel level) {
        return switch (level) {
            case LOW -> 0;
            case MEDIUM -> 50;
            case HIGH -> 100;
            case CRITICAL -> 200;
        };
    }

    public Donation updateDonation(Long id, Donation donationDetails) {
        Donation donation = getDonationById(id);
        
        donation.setBloodType(donationDetails.getBloodType());
        donation.setUnits(donationDetails.getUnits());
        donation.setPointsAwarded(donationDetails.getPointsAwarded());
        donation.setStatus(donationDetails.getStatus());
        donation.setUpdatedAt(LocalDateTime.now());
        
        return donationRepository.save(donation);
    }

    public Donation updateDonationStatus(Long id, Donation.DonationStatus status) {
        Donation donation = getDonationById(id);
        donation.setStatus(status);
        donation.setUpdatedAt(LocalDateTime.now());
        return donationRepository.save(donation);
    }

    public void deleteDonation(Long id) {
        donationRepository.deleteById(id);
    }

    public List<Donation> getDonationsByStatus(Donation.DonationStatus status) {
        return donationRepository.findByStatus(status);
    }

    public List<Donation> getDonationsByBloodType(String bloodType) {
        return donationRepository.findByBloodType(bloodType);
    }
}

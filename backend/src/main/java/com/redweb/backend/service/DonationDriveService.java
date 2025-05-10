package com.redweb.backend.service;

import com.redweb.backend.model.DonationDrive;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.DonationDriveRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationDriveService {

    @Autowired
    private DonationDriveRepository donationDriveRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DonationDrive> getAllDonationDrives() {
        return donationDriveRepository.findAll();
    }

    public DonationDrive getDonationDriveById(Long id) {
        return donationDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation drive not found with id: " + id));
    }

    public List<DonationDrive> getDonationDrivesByOrganizer(Long organizerId) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + organizerId));
        
        return donationDriveRepository.findByOrganizer(organizer);
    }

    public List<DonationDrive> getActiveDonationDrives() {
        LocalDateTime now = LocalDateTime.now();
        return donationDriveRepository.findByStartDateBeforeAndEndDateAfterAndStatus(
                now, now, DonationDrive.DriveStatus.ACTIVE);
    }

    public List<DonationDrive> getUpcomingDonationDrives() {
        return donationDriveRepository.findByStatus(DonationDrive.DriveStatus.UPCOMING);
    }

    public List<DonationDrive> getDonationDrivesByBloodType(String bloodType) {
        return donationDriveRepository.findByRequiredBloodTypesContaining(bloodType);
    }

    public DonationDrive createDonationDrive(Long organizerId, DonationDrive donationDrive) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + organizerId));
        
        donationDrive.setOrganizer(organizer);
        donationDrive.setCurrentDonors(0);
        donationDrive.setCreatedAt(LocalDateTime.now());
        donationDrive.setUpdatedAt(LocalDateTime.now());
        
        // Set initial status based on dates
        LocalDateTime now = LocalDateTime.now();
        if (donationDrive.getStartDate().isAfter(now)) {
            donationDrive.setStatus(DonationDrive.DriveStatus.UPCOMING);
        } else if (donationDrive.getEndDate().isAfter(now)) {
            donationDrive.setStatus(DonationDrive.DriveStatus.ACTIVE);
        } else {
            donationDrive.setStatus(DonationDrive.DriveStatus.COMPLETED);
        }
        
        return donationDriveRepository.save(donationDrive);
    }

    public DonationDrive updateDonationDrive(Long id, DonationDrive donationDriveDetails) {
        DonationDrive donationDrive = getDonationDriveById(id);
        
        donationDrive.setTitle(donationDriveDetails.getTitle());
        donationDrive.setDescription(donationDriveDetails.getDescription());
        donationDrive.setLatitude(donationDriveDetails.getLatitude());
        donationDrive.setLongitude(donationDriveDetails.getLongitude());
        donationDrive.setStartDate(donationDriveDetails.getStartDate());
        donationDrive.setEndDate(donationDriveDetails.getEndDate());
        donationDrive.setRequiredBloodTypes(donationDriveDetails.getRequiredBloodTypes());
        donationDrive.setMaxCapacity(donationDriveDetails.getMaxCapacity());
        donationDrive.setStatus(donationDriveDetails.getStatus());
        donationDrive.setUpdatedAt(LocalDateTime.now());
        
        return donationDriveRepository.save(donationDrive);
    }

    public DonationDrive updateDonationDriveStatus(Long id, DonationDrive.DriveStatus status) {
        DonationDrive donationDrive = getDonationDriveById(id);
        donationDrive.setStatus(status);
        donationDrive.setUpdatedAt(LocalDateTime.now());
        return donationDriveRepository.save(donationDrive);
    }

    public DonationDrive incrementCurrentDonors(Long id) {
        DonationDrive donationDrive = getDonationDriveById(id);
        
        if (donationDrive.getCurrentDonors() >= donationDrive.getMaxCapacity()) {
            throw new RuntimeException("Donation drive has reached its maximum capacity");
        }
        
        donationDrive.setCurrentDonors(donationDrive.getCurrentDonors() + 1);
        donationDrive.setUpdatedAt(LocalDateTime.now());
        
        return donationDriveRepository.save(donationDrive);
    }

    public DonationDrive decrementCurrentDonors(Long id) {
        DonationDrive donationDrive = getDonationDriveById(id);
        
        if (donationDrive.getCurrentDonors() > 0) {
            donationDrive.setCurrentDonors(donationDrive.getCurrentDonors() - 1);
            donationDrive.setUpdatedAt(LocalDateTime.now());
        }
        
        return donationDriveRepository.save(donationDrive);
    }

    public void deleteDonationDrive(Long id) {
        donationDriveRepository.deleteById(id);
    }
}

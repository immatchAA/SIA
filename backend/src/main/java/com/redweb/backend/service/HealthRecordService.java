package com.redweb.backend.service;

import com.redweb.backend.model.HealthRecord;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.HealthRecordRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private UserRepository userRepository;

    public List<HealthRecord> getAllHealthRecords() {
        return healthRecordRepository.findAll();
    }

    public HealthRecord getHealthRecordById(Long id) {
        return healthRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Health record not found with id: " + id));
    }

    public HealthRecord getHealthRecordByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        return healthRecordRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Health record not found for user: " + userId));
    }

    public HealthRecord createHealthRecord(Long userId, HealthRecord healthRecord) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if record already exists
        Optional<HealthRecord> existingRecord = healthRecordRepository.findByUser(user);
        if (existingRecord.isPresent()) {
            throw new RuntimeException("Health record already exists for user: " + userId);
        }

        healthRecord.setUser(user);
        healthRecord.setCreatedAt(LocalDateTime.now());
        healthRecord.setUpdatedAt(LocalDateTime.now());
        
        return healthRecordRepository.save(healthRecord);
    }

    public HealthRecord updateHealthRecord(Long id, HealthRecord healthRecordDetails) {
        HealthRecord healthRecord = getHealthRecordById(id);
        
        healthRecord.setLastDonationDate(healthRecordDetails.getLastDonationDate());
        healthRecord.setNextEligibleDate(healthRecordDetails.getNextEligibleDate());
        healthRecord.setMedicalConditions(healthRecordDetails.getMedicalConditions());
        healthRecord.setMedications(healthRecordDetails.getMedications());
        healthRecord.setMedicalNotes(healthRecordDetails.getMedicalNotes());
        healthRecord.setUpdatedAt(LocalDateTime.now());
        
        return healthRecordRepository.save(healthRecord);
    }

    public void deleteHealthRecord(Long id) {
        healthRecordRepository.deleteById(id);
    }

    public HealthRecord updateLastDonation(Long userId, LocalDate donationDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        HealthRecord healthRecord = healthRecordRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Health record not found for user: " + userId));
        
        healthRecord.setLastDonationDate(donationDate);
        // Assuming donors need 3 months before eligible again
        healthRecord.setNextEligibleDate(donationDate.plusMonths(3));
        healthRecord.setUpdatedAt(LocalDateTime.now());
        
        return healthRecordRepository.save(healthRecord);
    }

    public List<HealthRecord> getEligibleDonors() {
        return healthRecordRepository.findByNextEligibleDateBeforeAndUser_Role(
                LocalDate.now(), User.UserRole.DONOR);
    }
}

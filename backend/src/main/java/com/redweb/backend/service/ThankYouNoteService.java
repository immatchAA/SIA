package com.redweb.backend.service;

import com.redweb.backend.model.Donation;
import com.redweb.backend.model.ThankYouNote;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.DonationRepository;
import com.redweb.backend.repository.ThankYouNoteRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ThankYouNoteService {

    @Autowired
    private ThankYouNoteRepository thankYouNoteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    public List<ThankYouNote> getAllThankYouNotes() {
        return thankYouNoteRepository.findAll();
    }

    public ThankYouNote getThankYouNoteById(Long id) {
        return thankYouNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thank you note not found with id: " + id));
    }

    public List<ThankYouNote> getThankYouNotesByDonor(Long donorId) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + donorId));
        
        return thankYouNoteRepository.findByDonor(donor);
    }

    public List<ThankYouNote> getThankYouNotesByPatient(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + patientId));
        
        return thankYouNoteRepository.findByPatient(patient);
    }

    public List<ThankYouNote> getThankYouNotesByDonation(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + donationId));
        
        return thankYouNoteRepository.findByDonation(donation);
    }

    public ThankYouNote createThankYouNote(Long patientId, Long donorId, Long donationId, ThankYouNote thankYouNote) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with id: " + donorId));
        
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + donationId));
        
        // Check if a thank you note already exists for this donation and patient
        if (thankYouNoteRepository.existsByDonationAndPatient(donation, patient)) {
            throw new RuntimeException("A thank you note already exists for this donation");
        }
        
        thankYouNote.setPatient(patient);
        thankYouNote.setDonor(donor);
        thankYouNote.setDonation(donation);
        thankYouNote.setCreatedAt(LocalDateTime.now());
        
        // Add some points to the donor for receiving a thank you note
        addDonorPoints(donorId);
        
        return thankYouNoteRepository.save(thankYouNote);
    }

    private void addDonorPoints(Long donorId) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with id: " + donorId));
        
        int currentPoints = Integer.parseInt(donor.getPoints());
        int newPoints = currentPoints + 20; // Award 20 points for receiving a thank you note
        donor.setPoints(String.valueOf(newPoints));
        
        userRepository.save(donor);
    }

    public ThankYouNote updateThankYouNote(Long id, ThankYouNote thankYouNoteDetails) {
        ThankYouNote thankYouNote = getThankYouNoteById(id);
        
        thankYouNote.setMessage(thankYouNoteDetails.getMessage());
        thankYouNote.setAnonymous(thankYouNoteDetails.isAnonymous());
        
        return thankYouNoteRepository.save(thankYouNote);
    }

    public void deleteThankYouNote(Long id) {
        thankYouNoteRepository.deleteById(id);
    }
}

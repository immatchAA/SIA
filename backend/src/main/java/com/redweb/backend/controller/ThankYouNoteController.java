package com.redweb.backend.controller;

import com.redweb.backend.model.ThankYouNote;
import com.redweb.backend.service.ThankYouNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thank-you-notes")
public class ThankYouNoteController {

    @Autowired
    private ThankYouNoteService thankYouNoteService;

    @GetMapping
    public List<ThankYouNote> getAllThankYouNotes() {
        return thankYouNoteService.getAllThankYouNotes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThankYouNote> getThankYouNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(thankYouNoteService.getThankYouNoteById(id));
    }

    @GetMapping("/donor/{donorId}")
    public List<ThankYouNote> getThankYouNotesByDonor(@PathVariable Long donorId) {
        return thankYouNoteService.getThankYouNotesByDonor(donorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<ThankYouNote> getThankYouNotesByPatient(@PathVariable Long patientId) {
        return thankYouNoteService.getThankYouNotesByPatient(patientId);
    }

    @GetMapping("/donation/{donationId}")
    public List<ThankYouNote> getThankYouNotesByDonation(@PathVariable Long donationId) {
        return thankYouNoteService.getThankYouNotesByDonation(donationId);
    }

    @PostMapping("/patient/{patientId}/donor/{donorId}/donation/{donationId}")
    public ResponseEntity<ThankYouNote> createThankYouNote(
            @PathVariable Long patientId,
            @PathVariable Long donorId,
            @PathVariable Long donationId,
            @RequestBody ThankYouNote thankYouNote) {
        return new ResponseEntity<>(
                thankYouNoteService.createThankYouNote(patientId, donorId, donationId, thankYouNote),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThankYouNote> updateThankYouNote(
            @PathVariable Long id,
            @RequestBody ThankYouNote thankYouNoteDetails) {
        return ResponseEntity.ok(thankYouNoteService.updateThankYouNote(id, thankYouNoteDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteThankYouNote(@PathVariable Long id) {
        thankYouNoteService.deleteThankYouNote(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}

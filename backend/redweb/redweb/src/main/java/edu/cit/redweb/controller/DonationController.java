package edu.cit.redweb.controller;

import edu.cit.redweb.model.Donation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    @GetMapping
    public ResponseEntity<?> getAllDonations() {
        // In a real app, this would come from a database
        List<Donation> donations = generateMockDonations(10);
        return ResponseEntity.ok(donations);
    }
    
    @GetMapping("/{donationId}")
    public ResponseEntity<?> getDonationById(@PathVariable Long donationId) {
        // In a real app, this would be fetched from a database
        Donation donation = new Donation();
        donation.setId(donationId);
        donation.setDonorId(1L);
        donation.setDonationDate(new Date());
        donation.setBloodType("O+");
        donation.setAmount(1.0);
        donation.setLocation("RedWeb Donation Center");
        donation.setStatus("COMPLETED");
        
        return ResponseEntity.ok(donation);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDonationsByUser(@PathVariable Long userId) {
        // In a real app, this would be a database query
        List<Donation> donations = generateMockDonations(5);
        return ResponseEntity.ok(donations);
    }
    
    @PostMapping
    public ResponseEntity<?> createDonation(@RequestBody Donation donation) {
        // In a real app, you would save this to a database
        donation.setId(System.currentTimeMillis());
        donation.setStatus("SCHEDULED");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Donation scheduled successfully");
        response.put("donation", donation);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{donationId}")
    public ResponseEntity<?> updateDonation(@PathVariable Long donationId, @RequestBody Donation updatedDonation) {
        // In a real app, you would update the database
        updatedDonation.setId(donationId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Donation updated successfully");
        response.put("donation", updatedDonation);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{donationId}")
    public ResponseEntity<?> cancelDonation(@PathVariable Long donationId) {
        // In a real app, you might mark the donation as cancelled in the database
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Donation cancelled successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Helper method to generate mock data
    private List<Donation> generateMockDonations(int count) {
        List<Donation> donations = new ArrayList<>();
        String[] locations = {"RedWeb Center", "Community Hospital", "General Hospital", "Medical Center"};
        String[] bloodTypes = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        String[] statuses = {"SCHEDULED", "COMPLETED", "CANCELLED"};
        
        Random random = new Random();
        
        for (int i = 1; i <= count; i++) {
            Donation donation = new Donation();
            donation.setId((long) i);
            donation.setDonorId(1L);
            
            // Set date randomly within the last year
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_YEAR, -random.nextInt(365));
            donation.setDonationDate(cal.getTime());
            
            donation.setBloodType(bloodTypes[random.nextInt(bloodTypes.length)]);
            donation.setAmount(1.0);
            donation.setLocation(locations[random.nextInt(locations.length)]);
            donation.setStatus(statuses[random.nextInt(statuses.length)]);
            
            donations.add(donation);
        }
        
        // Sort by date (newest first)
        donations.sort((a, b) -> b.getDonationDate().compareTo(a.getDonationDate()));
        
        return donations;
    }
}

package com.redweb.backend.config;

import com.redweb.backend.model.Badge;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.BadgeRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BadgeRepository badgeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if we need to initialize the database
        if (userRepository.count() == 0) {
            initializeUsers();
        }
        
        if (badgeRepository.count() == 0) {
            initializeBadges();
        }
    }
    
    private void initializeUsers() {
        // Create admin user
        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@redweb.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setPhone("1234567890");
        admin.setBloodType("O+");
        admin.setLatitude(1.3521);
        admin.setLongitude(103.8198);
        admin.setRole(User.UserRole.ADMIN);
        admin.setEmergencyOptIn(false);
        admin.setPoints("1000");
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        userRepository.save(admin);
        
        // Create a demo donor
        User donor = new User();
        donor.setFirstName("Demo");
        donor.setLastName("Donor");
        donor.setEmail("donor@redweb.com");
        donor.setPassword(passwordEncoder.encode("donor123"));
        donor.setPhone("2345678901");
        donor.setBloodType("A+");
        donor.setLatitude(1.3521);
        donor.setLongitude(103.8198);
        donor.setRole(User.UserRole.DONOR);
        donor.setEmergencyOptIn(true);
        donor.setPoints("100");
        donor.setCreatedAt(LocalDateTime.now());
        donor.setUpdatedAt(LocalDateTime.now());
        userRepository.save(donor);
        
        // Create a demo patient
        User patient = new User();
        patient.setFirstName("Demo");
        patient.setLastName("Patient");
        patient.setEmail("patient@redweb.com");
        patient.setPassword(passwordEncoder.encode("patient123"));
        patient.setPhone("3456789012");
        patient.setBloodType("B+");
        patient.setLatitude(1.3521);
        patient.setLongitude(103.8198);
        patient.setRole(User.UserRole.PATIENT);
        patient.setEmergencyOptIn(false);
        patient.setPoints("0");
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());
        userRepository.save(patient);
    }
    
    private void initializeBadges() {
        // Create some initial badges
        Badge firstDonation = new Badge();
        firstDonation.setTitle("First Time Donor");
        firstDonation.setDescription("Awarded after completing your first blood donation");
        firstDonation.setPointsRequired(100);
        firstDonation.setCreatedAt(LocalDateTime.now());
        badgeRepository.save(firstDonation);
        
        Badge regularDonor = new Badge();
        regularDonor.setTitle("Regular Donor");
        regularDonor.setDescription("Completed 5 or more blood donations");
        regularDonor.setPointsRequired(500);
        regularDonor.setCreatedAt(LocalDateTime.now());
        badgeRepository.save(regularDonor);
        
        Badge emergencyHero = new Badge();
        emergencyHero.setTitle("Emergency Hero");
        emergencyHero.setDescription("Responded to at least one emergency blood request");
        emergencyHero.setPointsRequired(150);
        emergencyHero.setCreatedAt(LocalDateTime.now());
        badgeRepository.save(emergencyHero);
        
        Badge lifesaver = new Badge();
        lifesaver.setTitle("Lifesaver");
        lifesaver.setDescription("Donated blood in 10 or more occasions");
        lifesaver.setPointsRequired(1000);
        lifesaver.setCreatedAt(LocalDateTime.now());
        badgeRepository.save(lifesaver);
    }
}

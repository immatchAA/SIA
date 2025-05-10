package com.redweb.backend.controller;

import com.redweb.backend.dto.auth.DonorRegistrationRequest;
import com.redweb.backend.dto.auth.JwtAuthResponse;
import com.redweb.backend.dto.auth.LoginRequest;
import com.redweb.backend.dto.auth.PatientRegistrationRequest;
import com.redweb.backend.dto.auth.UserRegistrationRequest;
import com.redweb.backend.model.HealthRecord;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.HealthRecordRepository;
import com.redweb.backend.repository.UserRepository;
import com.redweb.backend.security.JwtTokenProvider;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


// Removed unused import: import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return ResponseEntity.ok(new JwtAuthResponse(jwt, user.getId(), user.getEmail(), 
                user.getRole().name(), user.getFirstName(), user.getLastName()));
    }

    @PostMapping("/register/donor")
    public ResponseEntity<?> registerDonor(@Valid @RequestBody DonorRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email is already taken");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Create new donor user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setBloodType(request.getBloodType());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        user.setRole(User.UserRole.DONOR);
        user.setEmergencyOptIn(request.isEmergencyOptIn());
        user.setPoints("0");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create initial health record for the donor
        HealthRecord healthRecord = new HealthRecord();
        healthRecord.setUser(savedUser);
        healthRecord.setLastDonationDate(LocalDate.now().minusMonths(4)); // Assuming eligible to donate
        healthRecord.setNextEligibleDate(LocalDate.now());
        healthRecord.setMedicalConditions("None");
        healthRecord.setMedications("None");
        healthRecord.setMedicalNotes("Initial health record");
        healthRecord.setCreatedAt(LocalDateTime.now());
        healthRecord.setUpdatedAt(LocalDateTime.now());
        
        healthRecordRepository.save(healthRecord);

        Map<String, String> response = new HashMap<>();
        response.put("success", "Donor registered successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email is already taken");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Create new user with unified registration
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setBloodType(request.getBloodType());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        
        // Default to DONOR role as per our simplified approach
        user.setRole(User.UserRole.DONOR);
        user.setEmergencyOptIn(request.isEmergencyOptIn());
        
        // Save the user
        User savedUser = userRepository.save(user);
        
        // Create a basic health record for tracking purposes
        HealthRecord healthRecord = new HealthRecord();
        healthRecord.setUser(savedUser);
        healthRecord.setLastDonationDate(null);
        healthRecord.setNextEligibleDate(null);
        healthRecord.setMedicalConditions("None specified");
        healthRecord.setMedications("None specified");
        healthRecord.setMedicalNotes("Initial health record for unified registration");
        healthRecord.setCreatedAt(LocalDateTime.now());
        healthRecord.setUpdatedAt(LocalDateTime.now());
        
        healthRecordRepository.save(healthRecord);

        Map<String, Object> response = new HashMap<>();
        response.put("success", "User registered successfully");
        response.put("id", savedUser.getId());
        response.put("email", savedUser.getEmail());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping(value = "/register/patient")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody PatientRegistrationRequest request) {
        // Log the registration attempt
        logger.info("Received patient registration request for email: " + request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email is already taken");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Create new patient user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setBloodType(request.getBloodType());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        user.setHospitalLocation(request.getHospitalLocation());
        user.setRole(User.UserRole.PATIENT);
        user.setEmergencyOptIn(false); // Patients don't opt-in for emergency donations
        user.setPoints("0");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create health record for the patient with their specific conditions
        HealthRecord healthRecord = new HealthRecord();
        healthRecord.setUser(savedUser);
        healthRecord.setLastDonationDate(null); // Patients don't donate
        healthRecord.setNextEligibleDate(null);
        healthRecord.setMedicalConditions(request.getMedicalConditions() != null ? request.getMedicalConditions() : "None specified");
        healthRecord.setMedications(request.getMedications() != null ? request.getMedications() : "None specified");
        healthRecord.setMedicalNotes("Initial patient health record");
        healthRecord.setCreatedAt(LocalDateTime.now());
        healthRecord.setUpdatedAt(LocalDateTime.now());
        
        // Handle verification document (make it optional)
        String documentPath = null;
        try {
            // Process the Base64-encoded verification document if provided
            if (request.getVerificationDocumentBase64() != null && !request.getVerificationDocumentBase64().isEmpty()) {
                logger.info("Processing verification document with filename: " + request.getVerificationDocumentFilename());
                
                try {
                    // Decode the Base64 string to binary data
                    String base64Data = request.getVerificationDocumentBase64();
                    // Remove the data:image/xyz;base64, prefix if present
                    if (base64Data.contains(",")) {
                        base64Data = base64Data.split(",")[1];
                    }
                    byte[] fileData = java.util.Base64.getDecoder().decode(base64Data);
                    
                    // Create a unique filename
                    String originalFilename = request.getVerificationDocumentFilename();
                    String fileExtension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                    
                    // Create directory if it doesn't exist
                    String uploadDir = "uploads/verification";
                    Path uploadPath = Paths.get(uploadDir);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }
                    
                    // Save the file
                    Path filePath = uploadPath.resolve(uniqueFilename);
                    Files.write(filePath, fileData);
                    
                    // Set the document path
                    documentPath = uploadDir + "/" + uniqueFilename;
                    logger.info("Successfully saved verification document to: " + documentPath);
                    
                } catch (Exception e) {
                    // Log the error but continue - make this non-blocking
                    logger.error("Error processing verification document: " + e.getMessage(), e);
                    documentPath = "Error saving document: " + e.getMessage();
                }
            } else {
                logger.info("No verification document provided in the request");
                documentPath = "No document provided";
            }
        } catch (Exception e) {
            // Catch any unexpected errors but don't fail registration
            logger.error("Unexpected error handling document: " + e.getMessage(), e);
            documentPath = "Error in document processing";
        }
        
        healthRecord.setMedicalNotes(healthRecord.getMedicalNotes() + "\nMedical verification document: " + documentPath);
        
        healthRecordRepository.save(healthRecord);

        Map<String, String> response = new HashMap<>();
        response.put("success", "Patient registered successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}

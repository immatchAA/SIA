package com.redweb.backend.controller;

import com.redweb.backend.dto.auth.PatientRegistrationRequest;
import com.redweb.backend.model.HealthRecord;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.HealthRecordRepository;
import com.redweb.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * This controller provides public registration endpoints that bypass security filters
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class PublicRegistrationController {

    private static final Logger logger = LoggerFactory.getLogger(PublicRegistrationController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Public endpoint for patient registration that bypasses all security filters
     */
    @PostMapping("/public/register/patient")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody PatientRegistrationRequest request) {
        logger.info("Received patient registration request in PublicRegistrationController for email: " + request.getEmail());
        
        try {
            // Check if email is already taken
            if (userRepository.existsByEmail(request.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email is already taken");
                return ResponseEntity.badRequest().body(response);
            }

            // Create new user
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
            user.setEmergencyOptIn(false);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);
            logger.info("Saved new patient user with ID: " + savedUser.getId());

            // Create health record
            HealthRecord healthRecord = new HealthRecord();
            healthRecord.setUser(savedUser);
            healthRecord.setMedicalConditions(request.getMedicalConditions());
            healthRecord.setMedications(request.getMedications());
            // Blood type is already in the User entity
            // There's no urgency field in HealthRecord - it would need to be added
            healthRecord.setMedicalNotes("");
            healthRecord.setLastDonationDate(null);
            healthRecord.setCreatedAt(LocalDateTime.now());
            healthRecord.setUpdatedAt(LocalDateTime.now());
            
            // Handle verification document
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
            logger.info("Saved health record for patient with ID: " + savedUser.getId());

            // Return success response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Patient registered successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            // Log detailed error information
            logger.error("Error in patient registration: " + e.getMessage(), e);
            
            // Return error response
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error registering patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

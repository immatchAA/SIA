package com.redweb.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;


@Data
public class PatientRegistrationRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number should be valid")
    private String phone;

    @NotBlank(message = "Blood type is required")
    private String bloodType;

    private double latitude;
    private double longitude;
    
    // Hospital location in the Philippines
    @NotBlank(message = "Hospital location is required")
    private String hospitalLocation;
    
    // Additional patient specific fields
    private String medicalConditions;
    private String medications;
    
    // Medical verification document as Base64 string
    private String verificationDocumentBase64;
    
    // Original filename for the verification document
    private String verificationDocumentFilename;
}

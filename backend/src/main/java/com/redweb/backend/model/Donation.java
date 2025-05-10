package com.redweb.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "donations")
public class Donation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;
    
    @ManyToOne
    @JoinColumn(name = "drive_id")
    private DonationDrive drive;
    
    @ManyToOne
    @JoinColumn(name = "emergency_request_id")
    private EmergencyRequest emergencyRequest;
    
    @Column(nullable = false)
    private LocalDateTime donationDate;
    
    @Column(nullable = false)
    private String bloodType;
    
    @Column(nullable = false)
    private double units;
    
    @Column(nullable = false)
    private int pointsAwarded;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum DonationStatus {
        SCHEDULED, COMPLETED, CANCELLED, VERIFIED
    }
}

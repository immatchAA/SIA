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
@Table(name = "emergency_responses")
public class EmergencyResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private EmergencyRequest request;
    
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResponseStatus status;
    
    @Column(nullable = false)
    private LocalDateTime estimatedArrivalTime;
    
    @Column(nullable = false)
    private double currentLatitude;
    
    @Column(nullable = false)
    private double currentLongitude;
    
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
    
    public enum ResponseStatus {
        ACCEPTED, EN_ROUTE, ARRIVED, COMPLETED, CANCELLED
    }
}

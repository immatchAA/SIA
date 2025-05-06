package com.example.RedWeb.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_request")
public class BloodRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bloodType;
    private String unitsNeeded;
    private String urgencyLevel;
    private String location;
    private String neededByDate;
    private String neededByTime;
    private String reason;
    private String additionalNotes;
    private boolean contactByEmail;
    private boolean contactByPhone;
    private boolean contactInApp;
    private boolean shareContact;
    @Column(nullable = false)
    private String createdByEmail;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public BloodRequestEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getUnitsNeeded() {
        return unitsNeeded;
    }

    public void setUnitsNeeded(String unitsNeeded) {
        this.unitsNeeded = unitsNeeded;
    }

    public String getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(String urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getNeededByDate() {
        return neededByDate;
    }

    public void setNeededByDate(String neededByDate) {
        this.neededByDate = neededByDate;
    }

    public String getNeededByTime() {
        return neededByTime;
    }

    public void setNeededByTime(String neededByTime) {
        this.neededByTime = neededByTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public boolean isContactByEmail() {
        return contactByEmail;
    }

    public void setContactByEmail(boolean contactByEmail) {
        this.contactByEmail = contactByEmail;
    }

    public boolean isContactByPhone() {
        return contactByPhone;
    }

    public void setContactByPhone(boolean contactByPhone) {
        this.contactByPhone = contactByPhone;
    }

    public boolean isContactInApp() {
        return contactInApp;
    }

    public void setContactInApp(boolean contactInApp) {
        this.contactInApp = contactInApp;
    }

    public boolean isShareContact() {
        return shareContact;
    }

    public void setShareContact(boolean shareContact) {
        this.shareContact = shareContact;
    }
}

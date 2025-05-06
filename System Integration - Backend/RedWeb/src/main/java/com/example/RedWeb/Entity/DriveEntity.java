package com.example.RedWeb.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "donation_drive")
public class DriveEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String driveTitle;
    private String organizedBy;
    private String date; // Or use LocalDate if you want better validation
    private String startTime;
    private String endTime;

    private String venueName;
    private String address;
    private String city;

    private String bloodTypesNeeded; // Save as comma-separated (e.g., "A+,B+,O-")
    private Boolean urgentNeed;
    private String urgentBloodType;

    private String description;
    private String additionalInfo;
    private String createdByEmail;



    public DriveEntity() {
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDriveTitle() {
        return driveTitle;
    }

    public void setDriveTitle(String driveTitle) {
        this.driveTitle = driveTitle;
    }

    public String getOrganizedBy() {
        return organizedBy;
    }

    public void setOrganizedBy(String organizedBy) {
        this.organizedBy = organizedBy;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getBloodTypesNeeded() {
        return bloodTypesNeeded;
    }

    public void setBloodTypesNeeded(String bloodTypesNeeded) {
        this.bloodTypesNeeded = bloodTypesNeeded;
    }

    public Boolean getUrgentNeed() {
        return urgentNeed;
    }

    public void setUrgentNeed(Boolean urgentNeed) {
        this.urgentNeed = urgentNeed;
    }

    public String getUrgentBloodType() {
        return urgentBloodType;
    }

    public void setUrgentBloodType(String urgentBloodType) {
        this.urgentBloodType = urgentBloodType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }
}

package edu.cit.redweb.model;

import java.util.Date;

public class BloodRequest {
    private Long id;
    private Long patientId;
    private String bloodType;
    private Double amountNeeded;
    private Date neededBy;
    private String hospital;
    private String status; // PENDING, FULFILLED, CANCELLED, URGENT
    private String medicalReason;
    private Date requestDate;
    
    // Constructor
    public BloodRequest() {
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getPatientId() {
        return patientId;
    }
    
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
    
    public String getBloodType() {
        return bloodType;
    }
    
    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }
    
    public Double getAmountNeeded() {
        return amountNeeded;
    }
    
    public void setAmountNeeded(Double amountNeeded) {
        this.amountNeeded = amountNeeded;
    }
    
    public Date getNeededBy() {
        return neededBy;
    }
    
    public void setNeededBy(Date neededBy) {
        this.neededBy = neededBy;
    }
    
    public String getHospital() {
        return hospital;
    }
    
    public void setHospital(String hospital) {
        this.hospital = hospital;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getMedicalReason() {
        return medicalReason;
    }
    
    public void setMedicalReason(String medicalReason) {
        this.medicalReason = medicalReason;
    }
    
    public Date getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(Date requestDate) {
        this.requestDate = requestDate;
    }
}

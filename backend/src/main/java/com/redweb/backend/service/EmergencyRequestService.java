package com.redweb.backend.service;

import com.redweb.backend.model.EmergencyRequest;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.EmergencyRequestRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmergencyRequestService {

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EmergencyRequest> getAllEmergencyRequests() {
        return emergencyRequestRepository.findAll();
    }

    public EmergencyRequest getEmergencyRequestById(Long id) {
        return emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency request not found with id: " + id));
    }

    public List<EmergencyRequest> getEmergencyRequestsByPatient(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + patientId));
        
        return emergencyRequestRepository.findByPatient(patient);
    }

    public List<EmergencyRequest> getActiveEmergencyRequests() {
        return emergencyRequestRepository.findByStatus(EmergencyRequest.RequestStatus.ACTIVE);
    }

    public List<EmergencyRequest> getEmergencyRequestsByBloodType(String bloodType) {
        return emergencyRequestRepository.findByBloodType(bloodType);
    }

    public List<EmergencyRequest> getActiveEmergencyRequestsByBloodType(String bloodType) {
        return emergencyRequestRepository.findByStatusAndBloodType(
                EmergencyRequest.RequestStatus.ACTIVE, bloodType);
    }

    public List<EmergencyRequest> getEmergencyRequestsByUrgency(EmergencyRequest.UrgencyLevel urgencyLevel) {
        return emergencyRequestRepository.findByUrgencyLevel(urgencyLevel);
    }

    public EmergencyRequest createEmergencyRequest(Long patientId, EmergencyRequest emergencyRequest) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + patientId));
        
        emergencyRequest.setPatient(patient);
        emergencyRequest.setCreatedAt(LocalDateTime.now());
        emergencyRequest.setUpdatedAt(LocalDateTime.now());
        
        // Set initial status to ACTIVE
        if (emergencyRequest.getStatus() == null) {
            emergencyRequest.setStatus(EmergencyRequest.RequestStatus.ACTIVE);
        }
        
        return emergencyRequestRepository.save(emergencyRequest);
    }

    public EmergencyRequest updateEmergencyRequest(Long id, EmergencyRequest emergencyRequestDetails) {
        EmergencyRequest emergencyRequest = getEmergencyRequestById(id);
        
        emergencyRequest.setBloodType(emergencyRequestDetails.getBloodType());
        emergencyRequest.setUnitsNeeded(emergencyRequestDetails.getUnitsNeeded());
        emergencyRequest.setLatitude(emergencyRequestDetails.getLatitude());
        emergencyRequest.setLongitude(emergencyRequestDetails.getLongitude());
        emergencyRequest.setStatus(emergencyRequestDetails.getStatus());
        emergencyRequest.setUrgencyLevel(emergencyRequestDetails.getUrgencyLevel());
        emergencyRequest.setNotes(emergencyRequestDetails.getNotes());
        emergencyRequest.setUpdatedAt(LocalDateTime.now());
        
        return emergencyRequestRepository.save(emergencyRequest);
    }

    public EmergencyRequest updateEmergencyRequestStatus(Long id, EmergencyRequest.RequestStatus status) {
        EmergencyRequest emergencyRequest = getEmergencyRequestById(id);
        emergencyRequest.setStatus(status);
        emergencyRequest.setUpdatedAt(LocalDateTime.now());
        return emergencyRequestRepository.save(emergencyRequest);
    }

    public void deleteEmergencyRequest(Long id) {
        emergencyRequestRepository.deleteById(id);
    }
}

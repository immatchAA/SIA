package com.redweb.backend.service;

import com.redweb.backend.model.EmergencyRequest;
import com.redweb.backend.model.EmergencyResponse;
import com.redweb.backend.model.User;
import com.redweb.backend.repository.EmergencyRequestRepository;
import com.redweb.backend.repository.EmergencyResponseRepository;
import com.redweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmergencyResponseService {

    @Autowired
    private EmergencyResponseRepository emergencyResponseRepository;

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EmergencyResponse> getAllEmergencyResponses() {
        return emergencyResponseRepository.findAll();
    }

    public EmergencyResponse getEmergencyResponseById(Long id) {
        return emergencyResponseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency response not found with id: " + id));
    }

    public List<EmergencyResponse> getEmergencyResponsesByDonor(Long donorId) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + donorId));
        
        return emergencyResponseRepository.findByDonor(donor);
    }

    public List<EmergencyResponse> getEmergencyResponsesByRequest(Long requestId) {
        EmergencyRequest request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found with id: " + requestId));
        
        return emergencyResponseRepository.findByRequest(request);
    }

    public List<EmergencyResponse> getEmergencyResponsesByStatus(EmergencyResponse.ResponseStatus status) {
        return emergencyResponseRepository.findByStatus(status);
    }

    public EmergencyResponse createEmergencyResponse(Long donorId, Long requestId, EmergencyResponse emergencyResponse) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + donorId));
        
        EmergencyRequest request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found with id: " + requestId));
        
        // Check if request is active
        if (request.getStatus() != EmergencyRequest.RequestStatus.ACTIVE) {
            throw new RuntimeException("Emergency request is not active");
        }
        
        // Check if donor already responded to this request
        if (emergencyResponseRepository.findByDonorAndRequest(donor, request).size() > 0) {
            throw new RuntimeException("Donor has already responded to this request");
        }
        
        emergencyResponse.setDonor(donor);
        emergencyResponse.setRequest(request);
        emergencyResponse.setCreatedAt(LocalDateTime.now());
        emergencyResponse.setUpdatedAt(LocalDateTime.now());
        
        // Set initial status if not provided
        if (emergencyResponse.getStatus() == null) {
            emergencyResponse.setStatus(EmergencyResponse.ResponseStatus.ACCEPTED);
        }
        
        return emergencyResponseRepository.save(emergencyResponse);
    }

    public EmergencyResponse updateEmergencyResponse(Long id, EmergencyResponse emergencyResponseDetails) {
        EmergencyResponse emergencyResponse = getEmergencyResponseById(id);
        
        emergencyResponse.setStatus(emergencyResponseDetails.getStatus());
        emergencyResponse.setEstimatedArrivalTime(emergencyResponseDetails.getEstimatedArrivalTime());
        emergencyResponse.setCurrentLatitude(emergencyResponseDetails.getCurrentLatitude());
        emergencyResponse.setCurrentLongitude(emergencyResponseDetails.getCurrentLongitude());
        emergencyResponse.setUpdatedAt(LocalDateTime.now());
        
        return emergencyResponseRepository.save(emergencyResponse);
    }

    public EmergencyResponse updateEmergencyResponseStatus(Long id, EmergencyResponse.ResponseStatus status) {
        EmergencyResponse emergencyResponse = getEmergencyResponseById(id);
        emergencyResponse.setStatus(status);
        emergencyResponse.setUpdatedAt(LocalDateTime.now());
        return emergencyResponseRepository.save(emergencyResponse);
    }

    public EmergencyResponse updateEmergencyResponseLocation(Long id, double latitude, double longitude) {
        EmergencyResponse emergencyResponse = getEmergencyResponseById(id);
        emergencyResponse.setCurrentLatitude(latitude);
        emergencyResponse.setCurrentLongitude(longitude);
        emergencyResponse.setUpdatedAt(LocalDateTime.now());
        return emergencyResponseRepository.save(emergencyResponse);
    }

    public void deleteEmergencyResponse(Long id) {
        emergencyResponseRepository.deleteById(id);
    }
}

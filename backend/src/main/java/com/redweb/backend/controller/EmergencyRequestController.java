package com.redweb.backend.controller;

import com.redweb.backend.model.EmergencyRequest;
import com.redweb.backend.service.EmergencyRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency-requests")
public class EmergencyRequestController {

    @Autowired
    private EmergencyRequestService emergencyRequestService;

    @GetMapping
    public List<EmergencyRequest> getAllEmergencyRequests() {
        return emergencyRequestService.getAllEmergencyRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyRequest> getEmergencyRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyRequestService.getEmergencyRequestById(id));
    }

    @GetMapping("/patient/{patientId}")
    public List<EmergencyRequest> getEmergencyRequestsByPatient(@PathVariable Long patientId) {
        return emergencyRequestService.getEmergencyRequestsByPatient(patientId);
    }

    @GetMapping("/active")
    public List<EmergencyRequest> getActiveEmergencyRequests() {
        return emergencyRequestService.getActiveEmergencyRequests();
    }

    @GetMapping("/blood-type/{bloodType}")
    public List<EmergencyRequest> getEmergencyRequestsByBloodType(@PathVariable String bloodType) {
        return emergencyRequestService.getEmergencyRequestsByBloodType(bloodType);
    }

    @GetMapping("/active/blood-type/{bloodType}")
    public List<EmergencyRequest> getActiveEmergencyRequestsByBloodType(@PathVariable String bloodType) {
        return emergencyRequestService.getActiveEmergencyRequestsByBloodType(bloodType);
    }

    @GetMapping("/urgency/{urgencyLevel}")
    public List<EmergencyRequest> getEmergencyRequestsByUrgency(@PathVariable String urgencyLevel) {
        EmergencyRequest.UrgencyLevel level = EmergencyRequest.UrgencyLevel.valueOf(urgencyLevel);
        return emergencyRequestService.getEmergencyRequestsByUrgency(level);
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<EmergencyRequest> createEmergencyRequest(
            @PathVariable Long patientId,
            @RequestBody EmergencyRequest emergencyRequest) {
        return new ResponseEntity<>(
                emergencyRequestService.createEmergencyRequest(patientId, emergencyRequest),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyRequest> updateEmergencyRequest(
            @PathVariable Long id,
            @RequestBody EmergencyRequest emergencyRequestDetails) {
        return ResponseEntity.ok(emergencyRequestService.updateEmergencyRequest(id, emergencyRequestDetails));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EmergencyRequest> updateEmergencyRequestStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        EmergencyRequest.RequestStatus requestStatus = EmergencyRequest.RequestStatus.valueOf(status);
        return ResponseEntity.ok(emergencyRequestService.updateEmergencyRequestStatus(id, requestStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmergencyRequest(@PathVariable Long id) {
        emergencyRequestService.deleteEmergencyRequest(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}

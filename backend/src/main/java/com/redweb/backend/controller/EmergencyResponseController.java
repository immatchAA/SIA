package com.redweb.backend.controller;

import com.redweb.backend.model.EmergencyResponse;
import com.redweb.backend.service.EmergencyResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency-responses")
public class EmergencyResponseController {

    @Autowired
    private EmergencyResponseService emergencyResponseService;

    @GetMapping
    public List<EmergencyResponse> getAllEmergencyResponses() {
        return emergencyResponseService.getAllEmergencyResponses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyResponse> getEmergencyResponseById(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyResponseService.getEmergencyResponseById(id));
    }

    @GetMapping("/donor/{donorId}")
    public List<EmergencyResponse> getEmergencyResponsesByDonor(@PathVariable Long donorId) {
        return emergencyResponseService.getEmergencyResponsesByDonor(donorId);
    }

    @GetMapping("/request/{requestId}")
    public List<EmergencyResponse> getEmergencyResponsesByRequest(@PathVariable Long requestId) {
        return emergencyResponseService.getEmergencyResponsesByRequest(requestId);
    }

    @GetMapping("/status/{status}")
    public List<EmergencyResponse> getEmergencyResponsesByStatus(@PathVariable String status) {
        EmergencyResponse.ResponseStatus responseStatus = EmergencyResponse.ResponseStatus.valueOf(status);
        return emergencyResponseService.getEmergencyResponsesByStatus(responseStatus);
    }

    @PostMapping("/donor/{donorId}/request/{requestId}")
    public ResponseEntity<EmergencyResponse> createEmergencyResponse(
            @PathVariable Long donorId,
            @PathVariable Long requestId,
            @RequestBody EmergencyResponse emergencyResponse) {
        return new ResponseEntity<>(
                emergencyResponseService.createEmergencyResponse(donorId, requestId, emergencyResponse),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyResponse> updateEmergencyResponse(
            @PathVariable Long id,
            @RequestBody EmergencyResponse emergencyResponseDetails) {
        return ResponseEntity.ok(emergencyResponseService.updateEmergencyResponse(id, emergencyResponseDetails));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EmergencyResponse> updateEmergencyResponseStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        EmergencyResponse.ResponseStatus responseStatus = EmergencyResponse.ResponseStatus.valueOf(status);
        return ResponseEntity.ok(emergencyResponseService.updateEmergencyResponseStatus(id, responseStatus));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<EmergencyResponse> updateEmergencyResponseLocation(
            @PathVariable Long id,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        return ResponseEntity.ok(
                emergencyResponseService.updateEmergencyResponseLocation(id, latitude, longitude));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmergencyResponse(@PathVariable Long id) {
        emergencyResponseService.deleteEmergencyResponse(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}

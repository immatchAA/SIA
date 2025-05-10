package edu.cit.redweb.controller;

import edu.cit.redweb.model.BloodRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        // In a real app, this would come from a database
        List<BloodRequest> requests = generateMockRequests(10);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/urgent")
    public ResponseEntity<?> getUrgentRequests() {
        // In a real app, this would be a database query filtered by urgency
        List<BloodRequest> urgentRequests = generateMockRequests(3);
        for (BloodRequest request : urgentRequests) {
            request.setStatus("URGENT");
        }
        return ResponseEntity.ok(urgentRequests);
    }
    
    @GetMapping("/{requestId}")
    public ResponseEntity<?> getRequestById(@PathVariable Long requestId) {
        // In a real app, this would be fetched from a database
        BloodRequest request = new BloodRequest();
        request.setId(requestId);
        request.setPatientId(1L);
        request.setBloodType("AB-");
        request.setAmountNeeded(2.0);
        request.setNeededBy(new Date(System.currentTimeMillis() + 86400000)); // tomorrow
        request.setHospital("General Hospital");
        request.setStatus("PENDING");
        request.setMedicalReason("Surgery");
        request.setRequestDate(new Date());
        
        return ResponseEntity.ok(request);
    }
    
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody BloodRequest request) {
        // In a real app, you would save this to a database
        request.setId(System.currentTimeMillis());
        request.setStatus("PENDING");
        request.setRequestDate(new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Blood request created successfully");
        response.put("request", request);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{requestId}")
    public ResponseEntity<?> updateRequest(@PathVariable Long requestId, @RequestBody BloodRequest updatedRequest) {
        // In a real app, you would update the database
        updatedRequest.setId(requestId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Blood request updated successfully");
        response.put("request", updatedRequest);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long requestId, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Blood request status updated to " + newStatus);
        response.put("requestId", requestId);
        response.put("status", newStatus);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{requestId}")
    public ResponseEntity<?> cancelRequest(@PathVariable Long requestId) {
        // In a real app, you might mark the request as cancelled in the database
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Blood request cancelled successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Helper method to generate mock data
    private List<BloodRequest> generateMockRequests(int count) {
        List<BloodRequest> requests = new ArrayList<>();
        String[] hospitals = {"General Hospital", "Community Medical Center", "Children's Hospital", "University Medical"};
        String[] bloodTypes = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        String[] statuses = {"PENDING", "FULFILLED", "CANCELLED", "URGENT"};
        String[] reasons = {"Surgery", "Accident", "Cancer Treatment", "Childbirth Complications", "Anemia"};
        
        Random random = new Random();
        
        for (int i = 1; i <= count; i++) {
            BloodRequest request = new BloodRequest();
            request.setId((long) i);
            request.setPatientId((long) (i + 100));
            
            // Request date within the last month
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_YEAR, -random.nextInt(30));
            request.setRequestDate(cal.getTime());
            
            // Needed by date between request date and 2 weeks from now
            Calendar neededBy = Calendar.getInstance();
            neededBy.setTime(request.getRequestDate());
            neededBy.add(Calendar.DAY_OF_YEAR, random.nextInt(14) + 1);
            request.setNeededBy(neededBy.getTime());
            
            request.setBloodType(bloodTypes[random.nextInt(bloodTypes.length)]);
            request.setAmountNeeded(random.nextInt(3) + 1.0);
            request.setHospital(hospitals[random.nextInt(hospitals.length)]);
            request.setStatus(statuses[random.nextInt(statuses.length)]);
            request.setMedicalReason(reasons[random.nextInt(reasons.length)]);
            
            requests.add(request);
        }
        
        // Sort by urgency and date
        requests.sort((a, b) -> {
            if (a.getStatus().equals("URGENT") && !b.getStatus().equals("URGENT")) {
                return -1;
            } else if (!a.getStatus().equals("URGENT") && b.getStatus().equals("URGENT")) {
                return 1;
            } else {
                return a.getNeededBy().compareTo(b.getNeededBy());
            }
        });
        
        return requests;
    }
}

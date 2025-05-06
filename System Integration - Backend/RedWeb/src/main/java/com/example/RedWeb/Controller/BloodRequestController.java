package com.example.RedWeb.Controller;

import com.example.RedWeb.DTO.BloodRequestDTO;
import com.example.RedWeb.Repo.BloodRequestRepository;
import com.example.RedWeb.Service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-request")
public class BloodRequestController {
    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping("/create")
    public ResponseEntity<String> createBloodRequest(@RequestBody BloodRequestDTO requestDto) {
        bloodRequestService.saveRequest(requestDto);
        return ResponseEntity.ok("Blood request created successfully");
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<BloodRequestDTO>> getRequestsByEmail(@PathVariable String email) {
        List<BloodRequestDTO> requests = bloodRequestService.getRequestsByEmail(email);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/get")
    public ResponseEntity<List<BloodRequestDTO>> getAllRequests() {
        List<BloodRequestDTO> requests = bloodRequestService.getAllRequestsSortedByDateDesc();
        return ResponseEntity.ok(requests);
    }
}


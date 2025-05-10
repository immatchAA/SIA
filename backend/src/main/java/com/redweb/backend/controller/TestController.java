package com.redweb.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class TestController {

    @GetMapping("/test-api")
    public ResponseEntity<?> testApi() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "API is working");
        return ResponseEntity.ok(response);
    }
}

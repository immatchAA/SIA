package edu.cit.redweb.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class RedWebController {
    @GetMapping()
    public Map<String, Object> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to RedWeb Blood Donation System API");
        response.put("version", "1.0.0");
        response.put("status", "online");
        return response;
    }
    
    @GetMapping("/api")
    public Map<String, Object> apiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("name", "RedWeb API");
        response.put("description", "Blood Donation Management System API");
        response.put("endpoints", new String[] {
            "/api/auth - Authentication endpoints",
            "/api/users - User management",
            "/api/donations - Blood donation management",
            "/api/requests - Blood request management"
        });
        return response;
    }
}

package com.example.RedWeb.Controller;

import com.example.RedWeb.DTO.UserRegisterDTO;
import com.example.RedWeb.DTO.LoginDTO;
import com.example.RedWeb.Entity.Users;
import com.example.RedWeb.Repo.UserRepository;
import com.example.RedWeb.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping(path = "/print")
    public String print() {
        return "Print test";
    }

    /*@PostMapping(value = "/register/patient", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerPatient(@ModelAttribute PatientRegisterDTO dto) {
        try {
            String message = authService.registerPatient(dto);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Server error"));
        }
    } */

    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO dto){
            if (!dto.password.equals(dto.confirmPassword)) {
                return ResponseEntity.badRequest().body("Password mismatch");
            }
            if (userRepository.existsByEmail(dto.email)) {
                return ResponseEntity.badRequest().body("Email is already registered");
            }

            Users user = new Users();
            user.setFullName(dto.fullName);
            user.setEmail(dto.email);
            user.setPhone(dto.phone);
            user.setBloodType(dto.bloodType);
            user.setAddress(dto.address);
            user.setHealthConditions(dto.healthConditions);
            user.setAvailableDays(dto.availableDays);
            user.setPassword(passwordEncoder.encode(dto.password));
            //user.setRole(dto.role);

            userRepository.save(user);
            return ResponseEntity.ok("User registered successfully");
        }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO dto) {
        Optional<Users> user = userRepository.findByEmail(dto.getEmail());
        Map<String, String> response = new HashMap<>();

        if (user.isPresent() && passwordEncoder.matches(dto.getPassword(), user.get().getPassword())) {
            response.put("message", "Login success");
            response.put("email", user.get().getEmail());
            return ResponseEntity.ok(response);
        }

        response.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}

package com.example.RedWeb.Service;

import com.example.RedWeb.DTO.UserRegisterDTO;
import com.example.RedWeb.DTO.LoginDTO;
import com.example.RedWeb.Entity.Users;
import com.example.RedWeb.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerUser(UserRegisterDTO dto) {
        if (!dto.password.equals(dto.confirmPassword)) {
            return "Password mismatch";
        }

        if (userRepository.existsByEmail(dto.email)) {
            return "Email already registered";
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
      //  user.setRole(dto.role);

        userRepository.save(user);
        return "User registered successfully";
    }

    public Map<String, String> login(LoginDTO dto) {
        Map<String, String> response = new HashMap<>();

        Optional<Users> userOpt = userRepository.findByEmail(dto.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(dto.getPassword(), userOpt.get().getPassword())) {
            response.put("message", "Login success");
            response.put("email", userOpt.get().getEmail());
            return response;
        }

        response.put("message", "Invalid credentials");
        return response;
    }

}


package com.example.RedWeb.Service;

import com.example.RedWeb.DTO.UserProfileDTO;
import com.example.RedWeb.Entity.Users;
import com.example.RedWeb.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Users updateUserProfile(UserProfileDTO userProfileDTO) {
        Users user = userRepository.findByEmail(userProfileDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update the user fields
        user.setFullName(userProfileDTO.getFullName());
        user.setPhone(userProfileDTO.getPhone());
        user.setAddress(userProfileDTO.getAddress());
        user.setBloodType(userProfileDTO.getBloodType());
        user.setHealthConditions(userProfileDTO.getHealthConditions());

        return userRepository.save(user);
    }
}

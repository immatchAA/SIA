package com.example.RedWeb.Controller;

import com.example.RedWeb.DTO.UserProfileDTO;
import com.example.RedWeb.Entity.Users;
import com.example.RedWeb.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {

    @Autowired
    private UserService userService;

    // Update user profile details
    @PutMapping("/update")
    public ResponseEntity<Users> updateUserProfile(@RequestBody UserProfileDTO userProfileDTO) {
        Users updatedUser = userService.updateUserProfile(userProfileDTO);
        return ResponseEntity.ok(updatedUser);
    }
}

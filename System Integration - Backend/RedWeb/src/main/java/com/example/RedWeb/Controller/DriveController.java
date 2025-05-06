package com.example.RedWeb.Controller;


import com.example.RedWeb.Entity.DriveEntity;
import com.example.RedWeb.Service.DriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")

    public class DriveController {

        @Autowired
        private DriveService driveService;

        @PostMapping("/create")
        public DriveEntity createDrive(@RequestBody DriveEntity drive) {
            return driveService.createDrive(drive);
        }

        @GetMapping("/all")
        public List<DriveEntity> getAllDrives() {
            return driveService.getAllDrives();
        }

        @GetMapping("/{id}")
        public DriveEntity getDriveById(@PathVariable Long id) {
            return driveService.getDriveById(id);
        }
}

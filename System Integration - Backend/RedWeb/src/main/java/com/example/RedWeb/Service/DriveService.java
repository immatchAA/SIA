package com.example.RedWeb.Service;

import com.example.RedWeb.Entity.DriveEntity;
import com.example.RedWeb.Repo.DriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriveService {

    @Autowired
    private DriveRepository driveRepository;

    public DriveEntity createDrive(DriveEntity drive) {
        return driveRepository.save(drive);
    }

    public List<DriveEntity> getAllDrives() {
        return driveRepository.findAll();
    }

    public DriveEntity getDriveById(Long id) {
        return driveRepository.findById(id).orElse(null);
    }
}

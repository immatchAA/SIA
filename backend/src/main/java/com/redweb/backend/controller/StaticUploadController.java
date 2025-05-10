package com.redweb.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
@CrossOrigin(origins = "*")
public class StaticUploadController {

    private static final Logger logger = LoggerFactory.getLogger(StaticUploadController.class);

    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, String>> handleFileUpload(@RequestParam("file") MultipartFile file) {
        logger.info("Received file upload request in StaticUploadController: " + 
                    (file != null ? file.getOriginalFilename() : "null"));
        
        Map<String, String> response = new HashMap<>();
        
        try {
            // Generate a unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            
            // Handle file extension safely
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Create upload directory if it doesn't exist
            String uploadDir = "uploads/verification";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Save the file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return success response with the filename
            response.put("success", "File uploaded successfully");
            response.put("filename", uniqueFilename);
            logger.info("File uploaded successfully in StaticUploadController: " + uniqueFilename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Error uploading file in StaticUploadController: " + e.getMessage(), e);
            response.put("error", "Could not upload file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

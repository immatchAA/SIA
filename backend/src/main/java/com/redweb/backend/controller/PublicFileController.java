package com.redweb.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)  // Allow from any origin
@RestController
@RequestMapping("/public")  // Note: NOT under /api path to avoid security filters
public class PublicFileController {
    
    private static final Logger logger = LoggerFactory.getLogger(PublicFileController.class);

    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("Received file upload request: " + (file != null ? file.getOriginalFilename() : "null"));
        
        // Check for null file first
        if (file == null) {
            logger.error("File upload failed: File is null");
            return ResponseEntity.badRequest()
                .body(Map.of("success", "false", "message", "File is null"));
        }
        
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
            if (file == null || file.isEmpty()) {
                logger.error("File upload failed: File is null or empty");
                return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("success", "false");
                        put("message", "File is null or empty");
                    }});
            }
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return success response with the filename
            Map<String, String> response = new HashMap<>();
            response.put("success", "File uploaded successfully");
            response.put("filename", uniqueFilename);
            logger.info("File uploaded successfully: " + uniqueFilename);
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Error uploading file: " + e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Could not upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error in file upload: " + e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

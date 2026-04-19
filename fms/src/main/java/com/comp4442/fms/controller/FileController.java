package com.comp4442.fms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.comp4442.fms.Service.FileService;
import com.comp4442.fms.entity.FileMetadata;
import com.comp4442.fms.entity.User;
import com.comp4442.fms.repository.UserRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/files")
public class FileController {
    
    @Autowired FileService fileService;

    @Autowired UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("username") String username) {
        try {
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            FileMetadata savedFile = fileService.uploadFile(file, user);
            return ResponseEntity.ok("File uploaded successfully with ID: " + savedFile.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUserFiles(@RequestParam("username") String username) {
        try {
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            List<FileMetadata> files = fileService.getUserFiles(user);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error loading files: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id, @RequestParam("username") String username) {
        try {
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            FileMetadata fileEntity = fileService.getFile(id).orElseThrow(() -> new RuntimeException("File not found"));
            byte[] fileData = fileService.downloadFile(fileEntity, user);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getOriginalFilename() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id, @RequestParam("username") String username) {
        try {
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            fileService.deleteFile(id, user);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting file: " + e.getMessage());
        }
    }
    














}

package com.comp4442.fms.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.comp4442.fms.entity.FileMetadata;
import com.comp4442.fms.entity.User;
import com.comp4442.fms.repository.FileRepository;

@Service
public class FileService {
    @Autowired FileRepository fileRepository;

    public FileMetadata uploadFile(MultipartFile file, User user) throws IOException {
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String storedFilename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(storedFilename);
        
        // Save file to disk
        Files.write(filePath, file.getBytes());
        
        FileMetadata fileMetadata = new FileMetadata();
        fileMetadata.setOriginalFilename(file.getOriginalFilename());
        fileMetadata.setStoredFilename(storedFilename);
        fileMetadata.setFileSize(file.getSize());
        fileMetadata.setUploadTime(LocalDateTime.now());
        fileMetadata.setFilePath(filePath.toString());
        fileMetadata.setUser(user);

        return fileRepository.save(fileMetadata);
    }
    
    public List<FileMetadata> getUserFiles(User user) {
        return fileRepository.findByUser(user);
    }
    
    public Optional<FileMetadata> getFile(Long id) {
        return fileRepository.findById(id);
    }
    
    public byte[] downloadFile(FileMetadata fileMetadata, User user) throws IOException {
        if (!fileMetadata.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to file");
        }
        return Files.readAllBytes(Paths.get(fileMetadata.getFilePath()));
    }
    
    public void deleteFile(Long id, User user) throws IOException {
        FileMetadata fileMetadata = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        if (!fileMetadata.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to file");
        }
        Files.deleteIfExists(Paths.get(fileMetadata.getFilePath()));
        fileRepository.deleteById(id);
    }
}

package com.comp4442.fms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comp4442.fms.entity.FileMetadata;
import com.comp4442.fms.entity.User;
import java.util.List;

public interface FileRepository extends JpaRepository<FileMetadata, Long>{
    Optional<FileMetadata> findByOriginalFilename(String filename);
    List<FileMetadata> findByUser(User user);
}

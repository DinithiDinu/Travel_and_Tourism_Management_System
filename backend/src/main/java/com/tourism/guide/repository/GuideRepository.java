package com.tourism.guide.repository;

import com.tourism.guide.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideRepository extends JpaRepository<Guide, Long> {
    Optional<Guide> findByUserId(Long userId);
    List<Guide> findByStatus(String status);
    List<Guide> findBySpecialization(String specialization);
}

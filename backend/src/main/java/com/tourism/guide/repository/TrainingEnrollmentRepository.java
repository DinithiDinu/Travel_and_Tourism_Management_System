package com.tourism.guide.repository;

import com.tourism.guide.entity.TrainingEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingEnrollmentRepository extends JpaRepository<TrainingEnrollment, Long> {
    List<TrainingEnrollment> findByGuideId(Long guideId);
    List<TrainingEnrollment> findByStatus(String status);
}

package com.tourism.guide.repository;

import com.tourism.guide.entity.TrainingProgramRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingRecommendationRepository extends JpaRepository<TrainingProgramRecommendation, Long> {
    List<TrainingProgramRecommendation> findByGuideId(Long guideId);
}

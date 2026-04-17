package com.tourism.guide.repository;

import com.tourism.guide.entity.PostTrainingEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostTrainingEvaluationRepository extends JpaRepository<PostTrainingEvaluation, Long> {
    List<PostTrainingEvaluation> findByGuideId(Long guideId);
    List<PostTrainingEvaluation> findByTrainingId(Long trainingId);
}

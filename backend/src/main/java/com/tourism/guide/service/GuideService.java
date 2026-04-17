package com.tourism.guide.service;

import com.tourism.guide.entity.*;
import com.tourism.guide.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GuideService {

    @Autowired
    private GuideRepository guideRepo;
    @Autowired
    private GuidePerformanceRepository performanceRepo;
    @Autowired
    private ReviewRepository reviewRepo;
    @Autowired
    private TrainingEnrollmentRepository trainingRepo;
    @Autowired
    private PostTrainingEvaluationRepository evaluationRepo;
    @Autowired
    private TrainingRecommendationRepository recommendationRepo;

    // ── Guides ──
    public List<Guide> getAllGuides() {
        return guideRepo.findAll();
    }

    public Optional<Guide> getGuideById(Long id) {
        return id == null ? Optional.empty() : guideRepo.findById(id);
    }

    public Guide saveGuide(Guide g) {
        if (g == null)
            throw new RuntimeException("Guide cannot be null");
        return guideRepo.save(g);
    }

    public void deleteGuide(Long id) {
        if (id != null)
            guideRepo.deleteById(id);
    }

    // ── Performances ──
    public List<GuidePerformance> getPerformanceByGuide(Long guideId) {
        return guideId == null ? List.of() : performanceRepo.findByGuideId(guideId);
    }

    public GuidePerformance updatePerformance(Long guideId) {
        if (guideId == null)
            throw new RuntimeException("Guide ID cannot be null");
        List<Review> reviews = reviewRepo.findByGuideId(guideId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        GuidePerformance perf = performanceRepo.findByGuideId(guideId)
                .stream().findFirst()
                .orElseGet(() -> {
                    GuidePerformance p = new GuidePerformance();
                    p.setGuideId(guideId);
                    return p;
                });
        perf.setAverageRating(avg);
        perf.setTotalReviews(reviews.size());
        perf.setEvaluationDate(LocalDate.now());
        return performanceRepo.save(perf);
    }

    public void deletePerformance(Long id) {
        if (id != null)
            performanceRepo.deleteById(id);
    }

    // ── Reviews ──
    public List<Review> getReviewsByGuide(Long guideId) {
        return guideId == null ? List.of() : reviewRepo.findByGuideId(guideId);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return userId == null ? List.of() : reviewRepo.findByUserId(userId);
    }

    public Review saveReview(Review r) {
        if (r == null)
            throw new RuntimeException("Review cannot be null");
        Review saved = reviewRepo.save(r);
        updatePerformance(r.getGuideId()); // auto-update performance
        return saved;
    }

    public void deleteReview(Long id) {
        if (id != null)
            reviewRepo.deleteById(id);
    }

    // ── Training Enrollments ──
    public List<TrainingEnrollment> getAllTrainings() {
        return trainingRepo.findAll();
    }

    public List<TrainingEnrollment> getTrainingsByGuide(Long guideId) {
        return guideId == null ? List.of() : trainingRepo.findByGuideId(guideId);
    }

    public TrainingEnrollment saveTraining(TrainingEnrollment t) {
        if (t == null)
            throw new RuntimeException("Training Cannot be null");
        return trainingRepo.save(t);
    }

    public void deleteTraining(Long id) {
        if (id != null)
            trainingRepo.deleteById(id);
    }

    // ── Post Training Evaluations ──
    public List<PostTrainingEvaluation> getEvaluationsByGuide(Long guideId) {
        return guideId == null ? List.of() : evaluationRepo.findByGuideId(guideId);
    }

    public PostTrainingEvaluation saveEvaluation(PostTrainingEvaluation e) {
        if (e == null)
            throw new RuntimeException("Evaluation cannot be null");
        return evaluationRepo.save(e);
    }

    public void deleteEvaluation(Long id) {
        if (id != null)
            evaluationRepo.deleteById(id);
    }

    // ── Recommendations ──
    public List<TrainingProgramRecommendation> getRecommendationsByGuide(Long guideId) {
        return guideId == null ? List.of() : recommendationRepo.findByGuideId(guideId);
    }

    public TrainingProgramRecommendation saveRecommendation(TrainingProgramRecommendation r) {
        if (r == null)
            throw new RuntimeException("Recommendation cannot be null");
        return recommendationRepo.save(r);
    }

    public void deleteRecommendation(Long id) {
        if (id != null)
            recommendationRepo.deleteById(id);
    }
}

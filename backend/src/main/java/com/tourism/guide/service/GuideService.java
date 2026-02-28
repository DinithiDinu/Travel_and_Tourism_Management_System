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

    @Autowired private GuideRepository guideRepo;
    @Autowired private GuidePerformanceRepository performanceRepo;
    @Autowired private ReviewRepository reviewRepo;
    @Autowired private TrainingEnrollmentRepository trainingRepo;
    @Autowired private PostTrainingEvaluationRepository evaluationRepo;
    @Autowired private TrainingRecommendationRepository recommendationRepo;

    // ── Guides ──
    public List<Guide> getAllGuides() { return guideRepo.findAll(); }
    public Optional<Guide> getGuideById(Long id) { return guideRepo.findById(id); }
    public Guide saveGuide(Guide g) { return guideRepo.save(g); }
    public void deleteGuide(Long id) { guideRepo.deleteById(id); }

    // ── Performances ──
    public List<GuidePerformance> getPerformanceByGuide(Long guideId) { return performanceRepo.findByGuideId(guideId); }
    public GuidePerformance updatePerformance(Long guideId) {
        List<Review> reviews = reviewRepo.findByGuideId(guideId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        GuidePerformance perf = performanceRepo.findByGuideId(guideId)
                .stream().findFirst()
                .orElseGet(() -> { GuidePerformance p = new GuidePerformance(); p.setGuideId(guideId); return p; });
        perf.setAverageRating(avg);
        perf.setTotalReviews(reviews.size());
        perf.setEvaluationDate(LocalDate.now());
        return performanceRepo.save(perf);
    }
    public void deletePerformance(Long id) { performanceRepo.deleteById(id); }

    // ── Reviews ──
    public List<Review> getReviewsByGuide(Long guideId) { return reviewRepo.findByGuideId(guideId); }
    public List<Review> getReviewsByUser(Long userId) { return reviewRepo.findByUserId(userId); }
    public Review saveReview(Review r) {
        Review saved = reviewRepo.save(r);
        updatePerformance(r.getGuideId()); // auto-update performance
        return saved;
    }
    public void deleteReview(Long id) { reviewRepo.deleteById(id); }

    // ── Training Enrollments ──
    public List<TrainingEnrollment> getAllTrainings() { return trainingRepo.findAll(); }
    public List<TrainingEnrollment> getTrainingsByGuide(Long guideId) { return trainingRepo.findByGuideId(guideId); }
    public TrainingEnrollment saveTraining(TrainingEnrollment t) { return trainingRepo.save(t); }
    public void deleteTraining(Long id) { trainingRepo.deleteById(id); }

    // ── Post Training Evaluations ──
    public List<PostTrainingEvaluation> getEvaluationsByGuide(Long guideId) { return evaluationRepo.findByGuideId(guideId); }
    public PostTrainingEvaluation saveEvaluation(PostTrainingEvaluation e) { return evaluationRepo.save(e); }
    public void deleteEvaluation(Long id) { evaluationRepo.deleteById(id); }

    // ── Recommendations ──
    public List<TrainingProgramRecommendation> getRecommendationsByGuide(Long guideId) { return recommendationRepo.findByGuideId(guideId); }
    public TrainingProgramRecommendation saveRecommendation(TrainingProgramRecommendation r) { return recommendationRepo.save(r); }
    public void deleteRecommendation(Long id) { recommendationRepo.deleteById(id); }
}

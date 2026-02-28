package com.tourism.guide.controller;

import com.tourism.guide.entity.*;
import com.tourism.guide.service.GuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guides")
@CrossOrigin(origins = "*")
public class GuideController {

    @Autowired private GuideService service;

    // ── Guides ──
    @GetMapping
    public List<Guide> getAllGuides() { return service.getAllGuides(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGuide(@PathVariable Long id) {
        return service.getGuideById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Guide createGuide(@RequestBody Guide g) { return service.saveGuide(g); }

    @PutMapping("/{id}")
    public Guide updateGuide(@PathVariable Long id, @RequestBody Guide g) {
        g.setGuideId(id);
        return service.saveGuide(g);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGuide(@PathVariable Long id) {
        service.deleteGuide(id);
        return ResponseEntity.ok(Map.of("message", "Guide deleted"));
    }

    // ── Reviews ──
    @GetMapping("/{guideId}/reviews")
    public List<Review> getReviews(@PathVariable Long guideId) { return service.getReviewsByGuide(guideId); }

    @PostMapping("/reviews")
    public Review createReview(@RequestBody Review r) { return service.saveReview(r); }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        service.deleteReview(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }

    // ── Performance ──
    @GetMapping("/{guideId}/performance")
    public List<GuidePerformance> getPerformance(@PathVariable Long guideId) { return service.getPerformanceByGuide(guideId); }

    @PostMapping("/{guideId}/performance/refresh")
    public GuidePerformance refreshPerformance(@PathVariable Long guideId) { return service.updatePerformance(guideId); }

    // ── Training Enrollments ──
    @GetMapping("/{guideId}/training")
    public List<TrainingEnrollment> getTrainings(@PathVariable Long guideId) { return service.getTrainingsByGuide(guideId); }

    @PostMapping("/training")
    public TrainingEnrollment createTraining(@RequestBody TrainingEnrollment t) { return service.saveTraining(t); }

    @PutMapping("/training/{id}")
    public TrainingEnrollment updateTraining(@PathVariable Long id, @RequestBody TrainingEnrollment t) {
        t.setTrainingId(id);
        return service.saveTraining(t);
    }

    @DeleteMapping("/training/{id}")
    public ResponseEntity<?> deleteTraining(@PathVariable Long id) {
        service.deleteTraining(id);
        return ResponseEntity.ok(Map.of("message", "Training deleted"));
    }

    // ── Evaluations ──
    @GetMapping("/{guideId}/evaluations")
    public List<PostTrainingEvaluation> getEvaluations(@PathVariable Long guideId) { return service.getEvaluationsByGuide(guideId); }

    @PostMapping("/evaluations")
    public PostTrainingEvaluation createEvaluation(@RequestBody PostTrainingEvaluation e) { return service.saveEvaluation(e); }

    @DeleteMapping("/evaluations/{id}")
    public ResponseEntity<?> deleteEvaluation(@PathVariable Long id) {
        service.deleteEvaluation(id);
        return ResponseEntity.ok(Map.of("message", "Evaluation deleted"));
    }

    // ── Recommendations ──
    @GetMapping("/{guideId}/recommendations")
    public List<TrainingProgramRecommendation> getRecommendations(@PathVariable Long guideId) {
        return service.getRecommendationsByGuide(guideId);
    }

    @PostMapping("/recommendations")
    public TrainingProgramRecommendation createRecommendation(@RequestBody TrainingProgramRecommendation r) {
        return service.saveRecommendation(r);
    }

    @DeleteMapping("/recommendations/{id}")
    public ResponseEntity<?> deleteRecommendation(@PathVariable Long id) {
        service.deleteRecommendation(id);
        return ResponseEntity.ok(Map.of("message", "Recommendation deleted"));
    }
}

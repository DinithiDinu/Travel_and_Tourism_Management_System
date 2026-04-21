package com.tourism.feedback.service;

import com.tourism.feedback.entity.Feedback;
import com.tourism.feedback.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    
    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

     public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(java.util.Objects.requireNonNull(feedback, "Feedback cannot be null"));
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public List<Feedback> getFeedbackByTarget(String targetType, String targetId) {
        return feedbackRepository.findByTargetTypeAndTargetId(targetType, targetId);
    }

     public Feedback updateFeedback(Long feedbackId, Feedback updatedFeedback) {
        if (feedbackId == null) throw new IllegalArgumentException("Feedback ID cannot be null");
        Feedback feedback = feedbackRepository.findById(feedbackId.longValue()).orElseThrow();

        feedback.setRating(updatedFeedback.getRating());
        feedback.setTitle(updatedFeedback.getTitle());
        feedback.setComment(updatedFeedback.getComment());
        feedback.setRecommend(updatedFeedback.getRecommend());

        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Long feedbackId) {
        if (feedbackId != null) {
            feedbackRepository.deleteById(feedbackId.longValue());
        }
    }
}

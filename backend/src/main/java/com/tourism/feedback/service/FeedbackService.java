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
        return feedbackRepository.save(feedback);
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
        Feedback feedback = feedbackRepository.findById(feedbackId).orElseThrow();

        feedback.setRating(updatedFeedback.getRating());
        feedback.setTitle(updatedFeedback.getTitle());
        feedback.setComment(updatedFeedback.getComment());
        feedback.setRecommend(updatedFeedback.getRecommend());
        feedback.setTargetType(updatedFeedback.getTargetType());
        feedback.setTargetId(updatedFeedback.getTargetId());

        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Long feedbackId) {
        feedbackRepository.deleteById(feedbackId);
    }
}

package com.tourism.feedback.repository;

import com.tourism.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByUserId(Long userId);  //for traveler’s “My Feedback”

    //for public destination reviews like get all reviews for Ella .. etc
    List<Feedback> findByTargetTypeAndTargetId(String targetType, String targetId);

    //admin can view all feedbacks and filter by status
    List<Feedback> findByStatus(String status);
}

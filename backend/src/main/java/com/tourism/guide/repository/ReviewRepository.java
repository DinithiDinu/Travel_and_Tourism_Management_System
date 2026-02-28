package com.tourism.guide.repository;

import com.tourism.guide.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByGuideId(Long guideId);
    List<Review> findByUserId(Long userId);
}

package com.tourism.guide.repository;

import com.tourism.guide.entity.GuidePerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuidePerformanceRepository extends JpaRepository<GuidePerformance, Long> {
    List<GuidePerformance> findByGuideId(Long guideId);
}

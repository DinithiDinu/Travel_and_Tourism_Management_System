package com.tourism.guide.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "guide_performances")
@Data
public class GuidePerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long performanceId;

    @Column(nullable = false)
    private Long guideId;

    private Double averageRating;
    private Integer totalReviews;
    private LocalDate evaluationDate;
}

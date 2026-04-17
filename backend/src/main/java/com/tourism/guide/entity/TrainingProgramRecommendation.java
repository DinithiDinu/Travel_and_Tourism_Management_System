package com.tourism.guide.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "training_recommendations")
@Data
public class TrainingProgramRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recommendationId;

    @Column(nullable = false)
    private Long guideId;

    private String programName;
    private String reason;
    private LocalDate recommendationDate;
}

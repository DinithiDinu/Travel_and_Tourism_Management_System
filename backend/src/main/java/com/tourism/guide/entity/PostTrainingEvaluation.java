package com.tourism.guide.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "post_training_evaluations")
@Data
public class PostTrainingEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evaluationId;

    @Column(nullable = false)
    private Long guideId;

    @Column(nullable = false)
    private Long trainingId;

    private Integer score;
    private String feedback;
    private LocalDate evaluationDate;
}

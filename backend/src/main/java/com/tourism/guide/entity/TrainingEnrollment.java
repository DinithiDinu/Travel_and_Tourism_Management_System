package com.tourism.guide.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "training_enrollments")
@Data
public class TrainingEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainingId;

    @Column(nullable = false)
    private Long guideId;

    private String trainingName;
    private String trainingProvider;
    private LocalDate enrollmentDate;
    private String status; // ENROLLED, COMPLETED, DROPPED
}

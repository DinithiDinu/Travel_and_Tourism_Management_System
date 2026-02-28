package com.tourism.guide.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "guide_reviews")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @Column(nullable = false)
    private Long guideId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer rating; // 1-5

    private String comment;
    private LocalDateTime reviewDate;

    @PrePersist
    public void prePersist() {
        this.reviewDate = LocalDateTime.now();
    }
}

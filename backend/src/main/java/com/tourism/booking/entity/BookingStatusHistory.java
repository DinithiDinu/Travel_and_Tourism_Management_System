package com.tourism.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_status_history")
@Data
public class BookingStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statusHistoryId;

    @Column(nullable = false)
    private Long bookingId;

    private String oldStatus;

    @Column(nullable = false)
    private String newStatus;

    private LocalDateTime changeDate;

    @PrePersist
    public void prePersist() {
        this.changeDate = LocalDateTime.now();
    }
}

package com.tourism.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "trip_id")
    private Long tripId;

    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "number_of_people")
    private Integer numberOfPeople;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "booking_status")
    private String status = "PENDING";

    private String specialRequests;

    @Column(name = "booked_at")
    private LocalDateTime bookingDate;

    @PrePersist
    public void prePersist() {
        this.bookingDate = LocalDateTime.now();
    }
}

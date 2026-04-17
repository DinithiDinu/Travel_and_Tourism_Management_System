package com.tourism.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hotel_bookings")
@Data
public class HotelBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "hotel_id")
    private String hotelId;

    @Column(name = "hotel_name", nullable = false)
    private String hotelName;

    private String location;

    private Integer nights;

    @Column(name = "check_in")
    private LocalDate checkIn;

    @Column(name = "check_out")
    private LocalDate checkOut;

    private Double amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "booking_status")
    private String status = "CONFIRMED";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "CONFIRMED";
    }
}

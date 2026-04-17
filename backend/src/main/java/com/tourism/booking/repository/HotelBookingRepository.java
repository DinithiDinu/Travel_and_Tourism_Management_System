package com.tourism.booking.repository;

import com.tourism.booking.entity.HotelBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HotelBookingRepository extends JpaRepository<HotelBooking, Long> {
    List<HotelBooking> findByUserIdOrderByCreatedAtDesc(Long userId);
}

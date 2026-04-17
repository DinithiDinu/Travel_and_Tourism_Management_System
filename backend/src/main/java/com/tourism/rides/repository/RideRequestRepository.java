package com.tourism.rides.repository;

import com.tourism.rides.entity.RideRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {
    List<RideRequest> findByBookingId(Long bookingId);

    List<RideRequest> findByStatus(String status);
}

package com.tourism.rides.repository;

import com.tourism.rides.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByRequestId(Long requestId);
    List<Ride> findByRiderId(Long riderId);
    List<Ride> findByStatus(String status);
}

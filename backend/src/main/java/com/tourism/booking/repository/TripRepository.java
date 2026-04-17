package com.tourism.booking.repository;

import com.tourism.booking.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByCategory(String category);
    List<Trip> findByStatus(String status);
    List<Trip> findByLocation(String location);
}

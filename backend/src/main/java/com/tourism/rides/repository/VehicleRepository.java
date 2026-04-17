package com.tourism.rides.repository;

import com.tourism.rides.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByRiderId(Long riderId);
    List<Vehicle> findByStatus(String status);
}

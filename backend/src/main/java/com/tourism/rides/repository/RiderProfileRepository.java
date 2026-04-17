package com.tourism.rides.repository;

import com.tourism.rides.entity.RiderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiderProfileRepository extends JpaRepository<RiderProfile, Long> {
    Optional<RiderProfile> findByUserId(Long userId);
    List<RiderProfile> findByStatus(String status);
}

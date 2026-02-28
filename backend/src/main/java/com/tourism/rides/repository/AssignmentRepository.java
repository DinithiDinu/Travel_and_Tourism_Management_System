package com.tourism.rides.repository;

import com.tourism.rides.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByRiderId(Long riderId);
    List<Assignment> findByServiceProviderId(Long serviceProviderId);
}

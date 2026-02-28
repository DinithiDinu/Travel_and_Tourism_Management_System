package com.tourism.booking.repository;

import com.tourism.booking.entity.TripCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripCategoryRepository extends JpaRepository<TripCategory, Long> {
}

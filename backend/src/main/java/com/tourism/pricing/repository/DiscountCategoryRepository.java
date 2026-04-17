package com.tourism.pricing.repository;

import com.tourism.pricing.entity.DiscountCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscountCategoryRepository extends JpaRepository<DiscountCategory, Long> {
    List<DiscountCategory> findByRoleType(String roleType);
}

package com.tourism.pricing.repository;

import com.tourism.pricing.entity.CoinRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoinRedemptionRepository extends JpaRepository<CoinRedemption, Long> {
    List<CoinRedemption> findByUserId(Long userId);
}

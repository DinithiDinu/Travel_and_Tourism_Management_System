package com.tourism.pricing.repository;

import com.tourism.pricing.entity.MemberTierOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberTierOfferRepository extends JpaRepository<MemberTierOffer, Long> {
    List<MemberTierOffer> findByTargetTier(String targetTier);

    List<MemberTierOffer> findByTargetTierOrTargetTier(String tier, String all);

    List<MemberTierOffer> findByIsHolidayTrue();

    List<MemberTierOffer> findByActiveTrue();
}

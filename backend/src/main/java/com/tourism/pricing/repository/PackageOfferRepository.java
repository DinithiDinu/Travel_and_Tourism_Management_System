package com.tourism.pricing.repository;

import com.tourism.pricing.entity.PackageOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageOfferRepository extends JpaRepository<PackageOffer, Long> {
    List<PackageOffer> findByPackageId(Long packageId);
}

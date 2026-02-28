package com.tourism.finance.repository;

import com.tourism.finance.entity.ServiceProviderPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceProviderPaymentRepository extends JpaRepository<ServiceProviderPayment, Long> {
    List<ServiceProviderPayment> findByProviderId(Long providerId);
    List<ServiceProviderPayment> findByStatus(String status);
}

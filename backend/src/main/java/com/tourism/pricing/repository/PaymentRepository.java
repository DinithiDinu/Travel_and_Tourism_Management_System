package com.tourism.pricing.repository;

import com.tourism.pricing.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
    List<Payment> findByPaymentStatus(String status);
    List<Payment> findByBookingId(Long bookingId);
}

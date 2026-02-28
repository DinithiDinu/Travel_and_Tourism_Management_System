package com.tourism.finance.repository;

import com.tourism.finance.entity.PayrollPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollPaymentRepository extends JpaRepository<PayrollPayment, Long> {
    List<PayrollPayment> findByEmployeeId(Long employeeId);
    List<PayrollPayment> findByStatus(String status);
}

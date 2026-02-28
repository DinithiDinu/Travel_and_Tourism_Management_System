package com.tourism.finance.repository;

import com.tourism.finance.entity.FinancialTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {
    List<FinancialTransaction> findByEmployeeId(Long employeeId);
    List<FinancialTransaction> findByTransactionType(String type);
}

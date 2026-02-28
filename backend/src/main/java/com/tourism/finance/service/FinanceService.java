package com.tourism.finance.service;

import com.tourism.finance.entity.*;
import com.tourism.finance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FinanceService {

    @Autowired private EmployeeRepository employeeRepo;
    @Autowired private ExpenseRepository expenseRepo;
    @Autowired private RevenueRepository revenueRepo;
    @Autowired private FinancialTransactionRepository transactionRepo;
    @Autowired private FinancialReportRepository reportRepo;
    @Autowired private PayrollPaymentRepository payrollRepo;
    @Autowired private ServiceProviderPaymentRepository providerPaymentRepo;

    // ── Employees ──
    public List<Employee> getAllEmployees() { return employeeRepo.findAll(); }
    public Optional<Employee> getEmployeeById(Long id) { return employeeRepo.findById(id); }
    public Employee saveEmployee(Employee e) { return employeeRepo.save(e); }
    public void deleteEmployee(Long id) { employeeRepo.deleteById(id); }

    // ── Expenses ──
    public List<Expense> getAllExpenses() { return expenseRepo.findAll(); }
    public Expense saveExpense(Expense e) { return expenseRepo.save(e); }
    public void deleteExpense(Long id) { expenseRepo.deleteById(id); }

    // ── Revenues ──
    public List<Revenue> getAllRevenues() { return revenueRepo.findAll(); }
    public Revenue saveRevenue(Revenue r) { return revenueRepo.save(r); }
    public void deleteRevenue(Long id) { revenueRepo.deleteById(id); }

    // ── Transactions ──
    public List<FinancialTransaction> getAllTransactions() { return transactionRepo.findAll(); }
    public List<FinancialTransaction> getTransactionsByEmployee(Long employeeId) {
        return transactionRepo.findByEmployeeId(employeeId);
    }
    public FinancialTransaction saveTransaction(FinancialTransaction t) { return transactionRepo.save(t); }
    public void deleteTransaction(Long id) { transactionRepo.deleteById(id); }

    // ── Reports ──
    public List<FinancialReport> getAllReports() { return reportRepo.findAll(); }
    public FinancialReport generateReport(FinancialReport report) {
        List<Revenue> revenues = revenueRepo.findAll();
        List<Expense> expenses = expenseRepo.findAll();
        double totalRev = revenues.stream().mapToDouble(r -> r.getAmount() != null ? r.getAmount() : 0.0).sum();
        double totalExp = expenses.stream().mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0).sum();
        report.setTotalRevenue(totalRev);
        report.setTotalExpense(totalExp);
        report.setNetProfit(totalRev - totalExp);
        return reportRepo.save(report);
    }
    public void deleteReport(Long id) { reportRepo.deleteById(id); }

    // ── Payroll ──
    public List<PayrollPayment> getAllPayrolls() { return payrollRepo.findAll(); }
    public List<PayrollPayment> getPayrollsByEmployee(Long employeeId) { return payrollRepo.findByEmployeeId(employeeId); }
    public PayrollPayment savePayroll(PayrollPayment p) { return payrollRepo.save(p); }
    public void deletePayroll(Long id) { payrollRepo.deleteById(id); }

    // ── Provider Payments ──
    public List<ServiceProviderPayment> getAllProviderPayments() { return providerPaymentRepo.findAll(); }
    public List<ServiceProviderPayment> getProviderPaymentsByProvider(Long providerId) {
        return providerPaymentRepo.findByProviderId(providerId);
    }
    public ServiceProviderPayment saveProviderPayment(ServiceProviderPayment p) { return providerPaymentRepo.save(p); }
    public void deleteProviderPayment(Long id) { providerPaymentRepo.deleteById(id); }
}

package com.tourism.finance.controller;

import com.tourism.finance.entity.*;
import com.tourism.finance.service.FinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*")
public class FinanceController {

    @Autowired private FinanceService service;

    // ── Employees ──
    @GetMapping("/employees")
    public List<Employee> getAllEmployees() { return service.getAllEmployees(); }

    @GetMapping("/employees/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable Long id) {
        return service.getEmployeeById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/employees")
    public Employee createEmployee(@RequestBody Employee e) { return service.saveEmployee(e); }

    @PutMapping("/employees/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee e) {
        e.setEmployeeId(id);
        return service.saveEmployee(e);
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        service.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee deleted"));
    }

    // ── Expenses ──
    @GetMapping("/expenses")
    public List<Expense> getAllExpenses() { return service.getAllExpenses(); }

    @PostMapping("/expenses")
    public Expense createExpense(@RequestBody Expense e) { return service.saveExpense(e); }

    @PutMapping("/expenses/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense e) {
        e.setExpenseId(id);
        return service.saveExpense(e);
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        service.deleteExpense(id);
        return ResponseEntity.ok(Map.of("message", "Expense deleted"));
    }

    // ── Revenues ──
    @GetMapping("/revenues")
    public List<Revenue> getAllRevenues() { return service.getAllRevenues(); }

    @PostMapping("/revenues")
    public Revenue createRevenue(@RequestBody Revenue r) { return service.saveRevenue(r); }

    @PutMapping("/revenues/{id}")
    public Revenue updateRevenue(@PathVariable Long id, @RequestBody Revenue r) {
        r.setRevenueId(id);
        return service.saveRevenue(r);
    }

    @DeleteMapping("/revenues/{id}")
    public ResponseEntity<?> deleteRevenue(@PathVariable Long id) {
        service.deleteRevenue(id);
        return ResponseEntity.ok(Map.of("message", "Revenue deleted"));
    }

    // ── Transactions ──
    @GetMapping("/transactions")
    public List<FinancialTransaction> getAllTransactions() { return service.getAllTransactions(); }

    @GetMapping("/transactions/employee/{employeeId}")
    public List<FinancialTransaction> getTransactionsByEmployee(@PathVariable Long employeeId) {
        return service.getTransactionsByEmployee(employeeId);
    }

    @PostMapping("/transactions")
    public FinancialTransaction createTransaction(@RequestBody FinancialTransaction t) { return service.saveTransaction(t); }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        service.deleteTransaction(id);
        return ResponseEntity.ok(Map.of("message", "Transaction deleted"));
    }

    // ── Reports ──
    @GetMapping("/reports")
    public List<FinancialReport> getAllReports() { return service.getAllReports(); }

    @PostMapping("/reports/generate")
    public FinancialReport generateReport(@RequestBody FinancialReport report) { return service.generateReport(report); }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        service.deleteReport(id);
        return ResponseEntity.ok(Map.of("message", "Report deleted"));
    }

    // ── Payroll ──
    @GetMapping("/payroll")
    public List<PayrollPayment> getAllPayrolls() { return service.getAllPayrolls(); }

    @GetMapping("/payroll/employee/{employeeId}")
    public List<PayrollPayment> getByEmployee(@PathVariable Long employeeId) { return service.getPayrollsByEmployee(employeeId); }

    @PostMapping("/payroll")
    public PayrollPayment createPayroll(@RequestBody PayrollPayment p) { return service.savePayroll(p); }

    @PutMapping("/payroll/{id}")
    public PayrollPayment updatePayroll(@PathVariable Long id, @RequestBody PayrollPayment p) {
        p.setPayrollId(id);
        return service.savePayroll(p);
    }

    @DeleteMapping("/payroll/{id}")
    public ResponseEntity<?> deletePayroll(@PathVariable Long id) {
        service.deletePayroll(id);
        return ResponseEntity.ok(Map.of("message", "Payroll deleted"));
    }

    // ── Provider Payments ──
    @GetMapping("/provider-payments")
    public List<ServiceProviderPayment> getAllProviderPayments() { return service.getAllProviderPayments(); }

    @GetMapping("/provider-payments/provider/{providerId}")
    public List<ServiceProviderPayment> getByProvider(@PathVariable Long providerId) {
        return service.getProviderPaymentsByProvider(providerId);
    }

    @PostMapping("/provider-payments")
    public ServiceProviderPayment createProviderPayment(@RequestBody ServiceProviderPayment p) { return service.saveProviderPayment(p); }

    @DeleteMapping("/provider-payments/{id}")
    public ResponseEntity<?> deleteProviderPayment(@PathVariable Long id) {
        service.deleteProviderPayment(id);
        return ResponseEntity.ok(Map.of("message", "Provider payment deleted"));
    }
}

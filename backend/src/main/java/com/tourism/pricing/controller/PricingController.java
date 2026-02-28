package com.tourism.pricing.controller;

import com.tourism.pricing.entity.*;
import com.tourism.pricing.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pricing")
@CrossOrigin(origins = "*")
public class PricingController {

    @Autowired private PricingService service;

    // ── Payments ──
    @GetMapping("/payments")
    public List<Payment> getAllPayments() { return service.getAllPayments(); }

    @GetMapping("/payments/user/{userId}")
    public List<Payment> getByUser(@PathVariable Long userId) { return service.getPaymentsByUser(userId); }

    @PostMapping("/payments")
    public Payment createPayment(@RequestBody Payment p) { return service.savePayment(p); }

    @PostMapping("/payments/process")
    public ResponseEntity<?> processPayment(@RequestBody Payment p) {
        try {
            return ResponseEntity.ok(service.processPayment(p));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/payments/{id}")
    public Payment updatePayment(@PathVariable Long id, @RequestBody Payment p) {
        p.setPaymentId(id);
        return service.savePayment(p);
    }

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        service.deletePayment(id);
        return ResponseEntity.ok(Map.of("message", "Payment deleted"));
    }

    // ── Wallets ──
    @GetMapping("/wallets/user/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable Long userId) {
        return ResponseEntity.ok(service.createOrGetWallet(userId));
    }

    @PostMapping("/wallets/topup")
    public ResponseEntity<?> topUp(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Double amount = Double.valueOf(body.get("amount").toString());
        return ResponseEntity.ok(service.topUpWallet(userId, amount));
    }

    @GetMapping("/wallets/{walletId}/transactions")
    public List<WalletTransaction> getTransactions(@PathVariable Long walletId) {
        return service.getWalletTransactions(walletId);
    }

    // ── Coin Redemptions ──
    @GetMapping("/coins/user/{userId}")
    public List<CoinRedemption> getRedemptions(@PathVariable Long userId) { return service.getRedemptionsByUser(userId); }

    @PostMapping("/coins/redeem")
    public ResponseEntity<?> redeemCoins(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            Integer coins = Integer.valueOf(body.get("coins").toString());
            return ResponseEntity.ok(service.redeemCoins(userId, coins));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Packages ──
    @GetMapping("/packages")
    public List<TourPackage> getAllPackages() { return service.getAllPackages(); }

    @GetMapping("/packages/{id}")
    public ResponseEntity<?> getPackage(@PathVariable Long id) {
        return service.getPackageById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/packages")
    public TourPackage createPackage(@RequestBody TourPackage p) { return service.savePackage(p); }

    @PutMapping("/packages/{id}")
    public TourPackage updatePackage(@PathVariable Long id, @RequestBody TourPackage p) {
        p.setPackageId(id);
        return service.savePackage(p);
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable Long id) {
        service.deletePackage(id);
        return ResponseEntity.ok(Map.of("message", "Package deleted"));
    }

    // ── Package Offers ──
    @GetMapping("/offers")
    public List<PackageOffer> getAllOffers() { return service.getAllOffers(); }

    @GetMapping("/offers/package/{packageId}")
    public List<PackageOffer> getOffersByPackage(@PathVariable Long packageId) { return service.getOffersByPackage(packageId); }

    @PostMapping("/offers")
    public PackageOffer createOffer(@RequestBody PackageOffer o) { return service.saveOffer(o); }

    @DeleteMapping("/offers/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        service.deleteOffer(id);
        return ResponseEntity.ok(Map.of("message", "Offer deleted"));
    }

    // ── Discounts ──
    @GetMapping("/discounts")
    public List<DiscountCategory> getAllDiscounts() { return service.getAllDiscounts(); }

    @PostMapping("/discounts")
    public DiscountCategory createDiscount(@RequestBody DiscountCategory d) { return service.saveDiscount(d); }

    @PutMapping("/discounts/{id}")
    public DiscountCategory updateDiscount(@PathVariable Long id, @RequestBody DiscountCategory d) {
        d.setDiscountId(id);
        return service.saveDiscount(d);
    }

    @DeleteMapping("/discounts/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        service.deleteDiscount(id);
        return ResponseEntity.ok(Map.of("message", "Discount deleted"));
    }
}

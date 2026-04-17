package com.tourism.pricing.service;

import com.tourism.auth.service.AuthService;
import com.tourism.pricing.entity.*;
import com.tourism.pricing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import com.tourism.pricing.repository.DiscountCategoryRepository;
import com.tourism.pricing.repository.MemberTierOfferRepository;
import com.tourism.pricing.repository.SavedCardRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class PricingService {

    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private WalletRepository walletRepo;
    @Autowired
    private WalletTransactionRepository walletTxRepo;
    @Autowired
    private CoinRedemptionRepository coinRepo;
    @Autowired
    private TourPackageRepository packageRepo;
    @Autowired
    private PackageOfferRepository offerRepo;
    @Autowired
    private DiscountCategoryRepository discountRepo;
    @Autowired
    private MemberTierOfferRepository tierOfferRepo;
    @Autowired
    private SavedCardRepository savedCardRepo;

    @Lazy
    @Autowired
    private AuthService authService;

    // ── Payments ──
    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepo.findByUserId(userId);
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepo.findById(id);
    }

    public Payment savePayment(Payment p) {
        return paymentRepo.save(p);
    }

    public Payment processPayment(Payment p) {
        p.setPaymentStatus("COMPLETED");
        Payment saved = paymentRepo.save(p);
        // Award coins: 1 coin per $10 spent
        int coins = (int) (p.getAmount() / 10);
        if (coins > 0) {
            Wallet wallet = walletRepo.findByUserId(p.getUserId())
                    .orElseGet(() -> {
                        Wallet w = new Wallet();
                        w.setUserId(p.getUserId());
                        return walletRepo.save(w);
                    });
            wallet.setTotalCoins(wallet.getTotalCoins() + coins);
            walletRepo.save(wallet);
            WalletTransaction tx = new WalletTransaction();
            tx.setWalletId(wallet.getWalletId());
            tx.setCoins(coins);
            tx.setTransactionType("CREDIT");
            tx.setDescription("Coins earned from payment #" + saved.getPaymentId());
            walletTxRepo.save(tx);
        }
        // Award star points: 1 point per $5 spent (for tier upgrades)
        int starPoints = (int) (p.getAmount() / 5);
        if (starPoints > 0 && p.getUserId() != null) {
            try {
                authService.addStarPoints(p.getUserId(), starPoints);
            } catch (Exception ignored) {
            }
        }
        return saved;
    }

    // ── Saved Cards ──
    public List<SavedCard> getSavedCardsByUser(Long userId) {
        return savedCardRepo.findByUserId(userId);
    }

    public SavedCard saveCard(SavedCard card) {
        if (Boolean.TRUE.equals(card.getIsDefault())) {
            List<SavedCard> existing = savedCardRepo.findByUserId(card.getUserId());
            for (SavedCard ec : existing) {
                if (!ec.getCardId().equals(card.getCardId())) {
                    ec.setIsDefault(false);
                    savedCardRepo.save(ec);
                }
            }
        } else {
            // if it's the only card, make it default regardless
            List<SavedCard> existing = savedCardRepo.findByUserId(card.getUserId());
            if (existing.isEmpty() || (existing.size() == 1 && existing.get(0).getCardId().equals(card.getCardId()))) {
                card.setIsDefault(true);
            }
        }
        return savedCardRepo.save(card);
    }

    public void deleteSavedCard(Long id) {
        savedCardRepo.deleteById(id);
    }

    public SavedCard setCardAsDefault(Long cardId, Long userId) {
        List<SavedCard> existing = savedCardRepo.findByUserId(userId);
        SavedCard target = null;
        for (SavedCard ec : existing) {
            if (ec.getCardId().equals(cardId)) {
                ec.setIsDefault(true);
                target = ec;
            } else {
                ec.setIsDefault(false);
            }
            savedCardRepo.save(ec);
        }
        return target;
    }

    public void deletePayment(Long id) {
        paymentRepo.deleteById(id);
    }

    // ── Wallets ──
    public Optional<Wallet> getWalletByUser(Long userId) {
        return walletRepo.findByUserId(userId);
    }

    public Wallet createOrGetWallet(Long userId) {
        return walletRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUserId(userId);
                    return walletRepo.save(w);
                });
    }

    public Wallet topUpWallet(Long userId, Double amount) {
        Wallet w = createOrGetWallet(userId);
        w.setBalance(w.getBalance() + amount);
        walletRepo.save(w);
        WalletTransaction tx = new WalletTransaction();
        tx.setWalletId(w.getWalletId());
        tx.setAmount(amount);
        tx.setTransactionType("CREDIT");
        tx.setDescription("Wallet top-up");
        walletTxRepo.save(tx);
        return w;
    }

    public List<WalletTransaction> getWalletTransactions(Long walletId) {
        return walletTxRepo.findByWalletId(walletId);
    }

    // ── Coin Redemptions ──
    public List<CoinRedemption> getRedemptionsByUser(Long userId) {
        return coinRepo.findByUserId(userId);
    }

    public CoinRedemption redeemCoins(Long userId, Integer coinsToRedeem) {
        Wallet wallet = walletRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        if (wallet.getTotalCoins() < coinsToRedeem)
            throw new RuntimeException("Insufficient coins");
        double discount = coinsToRedeem * 0.10; // 10 cents per coin
        wallet.setTotalCoins(wallet.getTotalCoins() - coinsToRedeem);
        walletRepo.save(wallet);
        CoinRedemption redemption = new CoinRedemption();
        redemption.setUserId(userId);
        redemption.setCoinsUsed(coinsToRedeem);
        redemption.setDiscountAmount(discount);
        return coinRepo.save(redemption);
    }

    // ── Packages ──
    public List<TourPackage> getAllPackages() {
        return packageRepo.findAll();
    }

    public Optional<TourPackage> getPackageById(Long id) {
        return packageRepo.findById(id);
    }

    public TourPackage savePackage(TourPackage p) {
        return packageRepo.save(p);
    }

    public void deletePackage(Long id) {
        packageRepo.deleteById(id);
    }

    // ── Package Offers ──
    public List<PackageOffer> getOffersByPackage(Long packageId) {
        return offerRepo.findByPackageId(packageId);
    }

    public List<PackageOffer> getAllOffers() {
        return offerRepo.findAll();
    }

    public PackageOffer saveOffer(PackageOffer o) {
        return offerRepo.save(o);
    }

    public void deleteOffer(Long id) {
        offerRepo.deleteById(id);
    }

    // ── Discount Categories ──
    public List<DiscountCategory> getAllDiscounts() {
        return discountRepo.findAll();
    }

    public DiscountCategory saveDiscount(DiscountCategory d) {
        return discountRepo.save(d);
    }

    public void deleteDiscount(Long id) {
        discountRepo.deleteById(id);
    }

    // ── Member Tier Offers ──
    public List<MemberTierOffer> getAllTierOffers() {
        return tierOfferRepo.findAll();
    }

    /**
     * Returns active offers for the given tier PLUS all-member and holiday offers
     */
    public List<MemberTierOffer> getOffersForTier(String tier) {
        List<MemberTierOffer> result = new ArrayList<>();
        result.addAll(tierOfferRepo.findByTargetTier(tier));
        // Add ALL-member offers not already included
        tierOfferRepo.findByTargetTier("ALL").forEach(o -> {
            if (!result.contains(o))
                result.add(o);
        });
        // Add active holiday offers
        tierOfferRepo.findByIsHolidayTrue().forEach(o -> {
            if (!result.contains(o))
                result.add(o);
        });
        return result.stream().filter(MemberTierOffer::isActive).toList();
    }

    public MemberTierOffer saveTierOffer(MemberTierOffer offer) {
        return tierOfferRepo.save(offer);
    }

    public void deleteTierOffer(Long id) {
        tierOfferRepo.deleteById(id);
    }
}

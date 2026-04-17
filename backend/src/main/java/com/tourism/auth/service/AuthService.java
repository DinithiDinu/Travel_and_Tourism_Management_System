package com.tourism.auth.service;

import com.tourism.auth.dto.LoginRequest;
import com.tourism.auth.dto.LoginResponse;
import com.tourism.auth.dto.RegisterRequest;
import com.tourism.auth.entity.*;
import com.tourism.auth.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@SuppressWarnings("null")
public class AuthService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private SessionRepository sessionRepo;
    @Autowired
    private AuditLogRepository auditRepo;
    @Autowired
    private PasswordResetRepository pwdResetRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse register(RegisterRequest req) {

        validateName(req.getFullName());

        if (req.getEmail() == null || !req.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        validatePassword(req.getPassword());

        String role = (req.getRole() != null && !req.getRole().isBlank()) ? req.getRole() : "TRAVELER";
        validateRole(role);

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setName(req.getFullName());
        user.setRole(role);
        user.setAccountStatus("ACTIVE");
        user = userRepo.save(user);

        log(user.getUserId(), "REGISTER");
        return buildToken(user);
    }
    
    //Admin can create user here
    public User createUserByAdmin(User newUser) {
    validateName(newUser.getName());

    if (newUser.getEmail() == null || !newUser.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
        throw new RuntimeException("Invalid email format");
    }

    if (userRepo.existsByEmail(newUser.getEmail().trim())) {
        throw new RuntimeException("Email already registered");
    }

    validatePassword(newUser.getPassword());
    validateRole(newUser.getRole());

    String status = (newUser.getAccountStatus() == null || newUser.getAccountStatus().isBlank())
            ? "ACTIVE"
            : newUser.getAccountStatus();
    validateAccountStatus(status);

    User user = new User();
    user.setName(newUser.getName().trim());
    user.setEmail(newUser.getEmail().trim());
    user.setPassword(passwordEncoder.encode(newUser.getPassword()));
    user.setRole(newUser.getRole());
    user.setAccountStatus(status);

    return userRepo.save(user);
}

    public LoginResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        if (!"ACTIVE".equals(user.getAccountStatus())) {
            throw new RuntimeException("Account is " + user.getAccountStatus());
        }
        log(user.getUserId(), "LOGIN");
        return buildToken(user);
    }

    public void logout(Long userId) {
        if (userId != null) {
            sessionRepo.deleteByUserId(userId);
            log(userId, "LOGOUT");
        }
    }

    public String requestPasswordReset(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        PasswordReset reset = new PasswordReset();
        reset.setUserId(user.getUserId());
        reset.setResetToken(UUID.randomUUID().toString());
        pwdResetRepo.save(reset);
        return reset.getResetToken(); // In real app: send via email
    }

    public void resetPassword(String token, String newPassword) {
        PasswordReset reset = pwdResetRepo.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (reset.isUsed())
            throw new RuntimeException("Token already used");
        User user = userRepo.findById(reset.getUserId() != null ? reset.getUserId() : 0L)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        reset.setUsed(true);
        pwdResetRepo.save(reset);
    }

    private LoginResponse buildToken(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());
        Session session = new Session();
        session.setUserId(user.getUserId());
        session.setToken(token);
        sessionRepo.save(session);
        return new LoginResponse(token, user.getUserId(), user.getEmail(), user.getName(), user.getRole());
    }

    private void log(Long userId, String action) {
        if (userId == null)
            return;
        AuditLog l = new AuditLog();
        l.setUserId(userId);
        l.setAction(action);
        auditRepo.save(l);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll().stream().filter(u -> !"DELETED".equals(u.getAccountStatus()))
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<User> getUserById(Long id) {
        return id == null ? Optional.empty() : userRepo.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return email == null ? Optional.empty() : userRepo.findByEmail(email);
    }

    public List<User> getUsersByRole(String role) {
        return role == null ? List.of() : userRepo.findByRole(role);
    }
  
    //Admin can update and reject if empty name, bad email, duplicate email, or invalid role/status
    public User updateUser(Long id, User updated) {
    if (id == null) {
        throw new RuntimeException("User not found");
    }

    User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

    if (updated.getName() != null) {
        validateName(updated.getName());
        user.setName(updated.getName().trim());
    }

    if (updated.getEmail() != null) {
        String email = updated.getEmail().trim();

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        Optional<User> existing = userRepo.findByEmail(email);
        if (existing.isPresent() && !existing.get().getUserId().equals(id)) {
            throw new RuntimeException("Email already registered");
        }

        user.setEmail(email);
    }

    if (updated.getAccountStatus() != null) {
        validateAccountStatus(updated.getAccountStatus());
        user.setAccountStatus(updated.getAccountStatus());
    }

    if (updated.getRole() != null) {
        validateRole(updated.getRole());
        user.setRole(updated.getRole());
    }

    return userRepo.save(user);
}

    public void deleteUser(Long id) {
        if (id == null)
            throw new RuntimeException("User not found");
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountStatus("DELETED");
        userRepo.save(user);
    }

    public List<AuditLog> getAuditLogs(Long userId) {
        return userId == null ? List.of() : auditRepo.findByUserIdOrderByActionTimeDesc(userId);
    }

    /**
     * Adds star points to a traveler and auto-recalculates their member tier.
     * Tiers: BRONZE (0+), SILVER (5000+), GOLD (10000+), PLATINUM (20000+)
     */
    public User addStarPoints(Long userId, Integer points) {
        if (userId == null)
            throw new RuntimeException("User not found");
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        int current = user.getStarPoints() == null ? 0 : user.getStarPoints();
        int updated = current + points;
        user.setStarPoints(updated);

        // Calculate new tier but prevent downgrades
        String newTier = calculateTier(updated);
        if (getTierWeight(newTier) > getTierWeight(user.getMemberTier())) {
            user.setMemberTier(newTier);
        }

        return userRepo.save(user);
    }

    /**
     * Deducts points from a user for redemptions without downgrading their lifetime
     * status.
     */
    public User redeemStarPoints(Long userId, Integer points) {
        if (userId == null)
            throw new RuntimeException("User not found");
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        int current = user.getStarPoints() == null ? 0 : user.getStarPoints();
        if (current < points) {
            throw new RuntimeException("Not enough star points for redemption.");
        }
        user.setStarPoints(current - points);
        // We explicitly DO NOT recalculate the tier to prevent downgrading PLATINUM
        // members
        return userRepo.save(user);
    }

    public static String calculateTier(int points) {
        if (points >= 20000)
            return "PLATINUM";
        if (points >= 10000)
            return "GOLD";
        if (points >= 5000)
            return "SILVER";
        return "BRONZE";
    }

    private int getTierWeight(String tier) {
    if (tier == null) return 0;

    switch (tier.toUpperCase()) {
        case "BRONZE":
            return 1;
        case "SILVER":
            return 2;
        case "GOLD":
            return 3;
        case "PLATINUM":
            return 4;
        default:
            return 0;
    }
}

    //this is for backend validation, password strength for user registration
    private void validatePassword(String password) {
    if (password == null || password.length() < 8) {
        throw new RuntimeException("Password must be at least 8 characters long");
    }

    if (!password.matches(".*[A-Za-z].*")) {
        throw new RuntimeException("Password must contain at least one letter");
    }

    if (!password.matches(".*\\d.*")) {
        throw new RuntimeException("Password must contain at least one number");
    }
}

//this is for backend validation, for admin updating user role, account status, and full name
private void validateRole(String role) {
    List<String> allowedRoles = List.of("TRAVELER", "ADMIN", "GUIDE", "RIDER");
    if (role == null || !allowedRoles.contains(role)) {
        throw new RuntimeException("Invalid role");
    }
}

private void validateAccountStatus(String status) {
    List<String> allowedStatuses = List.of("ACTIVE", "INACTIVE", "SUSPENDED", "DELETED");
    if (status == null || !allowedStatuses.contains(status)) {
        throw new RuntimeException("Invalid account status");
    }
}

private void validateName(String name) {
    if (name == null || name.trim().isEmpty()) {
        throw new RuntimeException("Full name is required");
    }
}

}

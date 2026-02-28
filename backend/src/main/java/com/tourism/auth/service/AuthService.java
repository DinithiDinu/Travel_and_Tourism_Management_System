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
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private SessionRepository sessionRepo;
    @Autowired private AuditLogRepository auditRepo;
    @Autowired private PasswordResetRepository pwdResetRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public LoginResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setName(req.getFullName());
        user.setRole(req.getRole() != null ? req.getRole() : "TRAVELER");
        user.setAccountStatus("ACTIVE");
        user = userRepo.save(user);

        log(user.getUserId(), "REGISTER");
        return buildToken(user);
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
        sessionRepo.deleteByUserId(userId);
        log(userId, "LOGOUT");
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
        if (reset.isUsed()) throw new RuntimeException("Token already used");
        User user = userRepo.findById(reset.getUserId())
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
        AuditLog l = new AuditLog();
        l.setUserId(userId);
        l.setAction(action);
        auditRepo.save(l);
    }

    public List<User> getAllUsers() { return userRepo.findAll().stream().filter(u -> !"DELETED".equals(u.getAccountStatus())).collect(java.util.stream.Collectors.toList()); }
    public Optional<User> getUserById(Long id) { return userRepo.findById(id); }
    public Optional<User> getUserByEmail(String email) { return userRepo.findByEmail(email); }
    public List<User> getUsersByRole(String role) { return userRepo.findByRole(role); }

    public User updateUser(Long id, User updated) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (updated.getName() != null) user.setName(updated.getName());
        if (updated.getAccountStatus() != null) user.setAccountStatus(updated.getAccountStatus());
        if (updated.getRole() != null) user.setRole(updated.getRole());
        return userRepo.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountStatus("DELETED");
        userRepo.save(user);
    }

    public List<AuditLog> getAuditLogs(Long userId) { return auditRepo.findByUserIdOrderByActionTimeDesc(userId); }
}

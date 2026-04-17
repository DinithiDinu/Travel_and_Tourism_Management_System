package com.tourism.ticket.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    private Long userId;

    private String subject;

     @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    private String status = "OPEN";

     @Column(columnDefinition = "TEXT")
    private String adminResponse;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // This is getters and Setters for TicketService.java to work with the Ticket entity
    public Long getTicketId() {
    return ticketId;
}

public void setTicketId(Long ticketId) {
    this.ticketId = ticketId;
}

public Long getUserId() {
    return userId;
}

public void setUserId(Long userId) {
    this.userId = userId;
}

public String getSubject() {
    return subject;
}

public void setSubject(String subject) {
    this.subject = subject;
}

public String getDescription() {
    return description;
}

public void setDescription(String description) {
    this.description = description;
}

public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}

public String getAdminResponse() {
    return adminResponse;
}

public void setAdminResponse(String adminResponse) {
    this.adminResponse = adminResponse;
}

public java.time.LocalDateTime getCreatedAt() {
    return createdAt;
}

public void setCreatedAt(java.time.LocalDateTime createdAt) {
    this.createdAt = createdAt;
}

public java.time.LocalDateTime getUpdatedAt() {
    return updatedAt;
}

public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}

//getters and setters for category
public String getCategory() {
    return category;    
}
public void setCategory(String category) {
    this.category = category;
}
}

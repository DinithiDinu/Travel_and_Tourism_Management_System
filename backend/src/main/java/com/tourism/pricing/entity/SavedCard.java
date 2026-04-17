package com.tourism.pricing.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "saved_cards")
@Data
public class SavedCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cardId;

    @Column(nullable = false)
    private Long userId;

    private String cardName;
    private String cardNumberLast4;
    private String expiryDate;
    private String cvv;
    private String cardType;
    private String brandColor;
    private Boolean isDefault = false;
}

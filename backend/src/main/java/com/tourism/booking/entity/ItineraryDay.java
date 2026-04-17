package com.tourism.booking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ItineraryDay {
    private String title;
    private String location;
    
    @Column(length = 2000)
    private String description;
}

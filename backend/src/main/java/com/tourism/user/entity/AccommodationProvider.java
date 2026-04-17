package com.tourism.user.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "accommodation_providers")
@Data
public class AccommodationProvider {

    @Id
    private Long userId; // Same as User.userId (ISA)

    private String businessName;
    private String businessAddress;
    private String contactPhone;
    private String businessType; // HOTEL, HOSTEL, RESORT, VILLA
}

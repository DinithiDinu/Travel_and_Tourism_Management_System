package com.tourism.user.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "members")
@Data
public class Member {

    @Id
    private Long userId; // Same as User.userId (ISA)

    private String membershipType; // BASIC, PREMIUM, VIP
}

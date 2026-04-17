package com.tourism.user.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "admin_profiles")
@Data
public class AdminProfile {

    @Id
    private Long userId; // Same as User.userId (ISA)

    private String accessLevel; // FULL, PARTIAL, READ_ONLY
}

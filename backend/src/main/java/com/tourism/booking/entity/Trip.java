package com.tourism.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "trips")
@Data
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_id")
    private Long id;

    @Column(name = "trip_name")
    private String title;

    @Column(name = "trip_description")
    private String description;

    private String location;

    @Column(name = "duration_days")
    private Integer durationDays;

    private Integer capacity;
    private Double price;

    private String category;
    private String difficulty;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "cover_image")
    private String coverImage;

    private String status = "ACTIVE";
    
    @Column(name = "trip_status")
    private String tripStatus;

    @Column(name = "long_description", length = 3000)
    private String longDescription;

    private String destination;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "booking_deadline")
    private LocalDate bookingDeadline;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "child_price")
    private Double childPrice;

    private String currency;

    @Column(name = "discount_percentage")
    private Double discountPercentage;

    @Column(name = "deposit_amount")
    private Double depositAmount;

    @Column(name = "cancellation_policy", length = 2000)
    private String cancellationPolicy;

    @ElementCollection
    @CollectionTable(name = "trip_included_items", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "item")
    private List<String> includedItems;

    @ElementCollection
    @CollectionTable(name = "trip_excluded_items", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "item")
    private List<String> excludedItems;

    @ElementCollection
    @CollectionTable(name = "trip_tags", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "tag")
    private List<String> tags;

    @ElementCollection
    @CollectionTable(name = "trip_gallery", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "image_url")
    private List<String> gallery;

    @ElementCollection
    @CollectionTable(name = "trip_itinerary", joinColumns = @JoinColumn(name = "trip_id"))
    private List<ItineraryDay> itinerary;
}

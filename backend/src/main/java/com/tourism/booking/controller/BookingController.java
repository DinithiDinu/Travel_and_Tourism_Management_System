package com.tourism.booking.controller;

import com.tourism.booking.entity.*;
import com.tourism.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired private BookingService service;

    // ── Bookings ──
    @GetMapping
    public List<Booking> getAll() { return service.getAllBookings(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return service.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getByUser(@PathVariable Long userId) { return service.getBookingsByUser(userId); }

    @GetMapping("/status/{status}")
    public List<Booking> getByStatus(@PathVariable String status) { return service.getBookingsByStatus(status); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(service.createBooking(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(service.updateBookingStatus(id, body.get("status")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteBooking(id);
        return ResponseEntity.ok(Map.of("message", "Booking deleted"));
    }

    @GetMapping("/{id}/history")
    public List<BookingStatusHistory> getHistory(@PathVariable Long id) { return service.getHistoryByBooking(id); }

    // ── Categories ──
    @GetMapping("/categories")
    public List<TripCategory> getAllCategories() { return service.getAllCategories(); }

    @PostMapping("/categories")
    public TripCategory createCategory(@RequestBody TripCategory cat) { return service.saveCategory(cat); }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted"));
    }

    // ── Schedules ──
    @GetMapping("/schedules")
    public List<TripSchedule> getAllSchedules() { return service.getAllSchedules(); }

    @GetMapping("/schedules/trip/{tripId}")
    public List<TripSchedule> getSchedulesByTrip(@PathVariable Long tripId) { return service.getSchedulesByTrip(tripId); }

    @PostMapping("/schedules")
    public TripSchedule createSchedule(@RequestBody TripSchedule schedule) { return service.saveSchedule(schedule); }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        service.deleteSchedule(id);
        return ResponseEntity.ok(Map.of("message", "Schedule deleted"));
    }
}

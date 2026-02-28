package com.tourism.booking.service;

import com.tourism.booking.entity.*;
import com.tourism.booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired private BookingRepository bookingRepo;
    @Autowired private TripRepository tripRepo;
    @Autowired private TripCategoryRepository categoryRepo;
    @Autowired private TripScheduleRepository scheduleRepo;
    @Autowired private BookingStatusHistoryRepository historyRepo;

    // ── Booking CRUD ──
    public List<Booking> getAllBookings() { return bookingRepo.findAll(); }
    public Optional<Booking> getBookingById(Long id) { return bookingRepo.findById(id); }
    public List<Booking> getBookingsByUser(Long userId) { return bookingRepo.findByUserId(userId); }
    public List<Booking> getBookingsByStatus(String status) { return bookingRepo.findByStatus(status); }

    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING");
        Booking saved = bookingRepo.save(booking);
        recordStatusChange(saved.getBookingId(), null, "PENDING");
        return saved;
    }

    public Booking updateBookingStatus(Long id, String newStatus) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        String old = booking.getStatus();
        booking.setStatus(newStatus);
        bookingRepo.save(booking);
        recordStatusChange(id, old, newStatus);
        return booking;
    }

    public void deleteBooking(Long id) { bookingRepo.deleteById(id); }

    // ── Trip CRUD ──
    public List<Trip> getAllTrips() { return tripRepo.findAll(); }
    public Optional<Trip> getTripById(Long id) { return tripRepo.findById(id); }
    public List<Trip> getTripsByCategory(String category) { return tripRepo.findByCategory(category); }
    public Trip saveTrip(Trip trip) { return tripRepo.save(trip); }
    public void deleteTrip(Long id) { tripRepo.deleteById(id); }

    // ── Category CRUD ──
    public List<TripCategory> getAllCategories() { return categoryRepo.findAll(); }
    public TripCategory saveCategory(TripCategory cat) { return categoryRepo.save(cat); }
    public void deleteCategory(Long id) { categoryRepo.deleteById(id); }

    // ── Schedule CRUD ──
    public List<TripSchedule> getSchedulesByTrip(Long tripId) { return scheduleRepo.findByTripId(tripId); }
    public List<TripSchedule> getAllSchedules() { return scheduleRepo.findAll(); }
    public TripSchedule saveSchedule(TripSchedule s) { return scheduleRepo.save(s); }
    public void deleteSchedule(Long id) { scheduleRepo.deleteById(id); }

    // ── Status History ──
    public List<BookingStatusHistory> getHistoryByBooking(Long bookingId) { return historyRepo.findByBookingId(bookingId); }

    private void recordStatusChange(Long bookingId, String oldStatus, String newStatus) {
        BookingStatusHistory h = new BookingStatusHistory();
        h.setBookingId(bookingId);
        h.setOldStatus(oldStatus);
        h.setNewStatus(newStatus);
        historyRepo.save(h);
    }
}

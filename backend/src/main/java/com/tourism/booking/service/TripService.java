package com.tourism.booking.service;

import com.tourism.booking.entity.Trip;
import com.tourism.booking.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    @Autowired
    private TripRepository repository;

    public List<Trip> getAllTrips() {
        return repository.findAll();
    }

    public Trip getTripById(Long id) {
        return id == null ? null : repository.findById(id).orElse(null);
    }

    public Trip saveTrip(Trip trip) {
        if (trip == null)
            throw new RuntimeException("Trip cannot be null");
        return repository.save(trip);
    }

    public void deleteTrip(Long id) {
        if (id != null)
            repository.deleteById(id);
    }
}

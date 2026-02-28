package com.tourism.booking.controller;

import com.tourism.booking.entity.Trip;
import com.tourism.booking.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings/trips")
@CrossOrigin(origins = "*")
public class TripController {

    @Autowired
    private TripService service;

    @GetMapping
    public List<Trip> getAll() {
        return service.getAllTrips();
    }

    @GetMapping("/{id}")
    public Trip getById(@PathVariable Long id) {
        return service.getTripById(id);
    }

    @PostMapping
    public Trip create(@RequestBody Trip trip) {
        return service.saveTrip(trip);
    }

    @PutMapping("/{id}")
    public Trip update(@PathVariable Long id, @RequestBody Trip trip) {
        trip.setId(id);
        return service.saveTrip(trip);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteTrip(id);
    }
}

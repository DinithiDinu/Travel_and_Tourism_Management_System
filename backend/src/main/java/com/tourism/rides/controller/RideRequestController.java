package com.tourism.rides.controller;

import com.tourism.rides.entity.RideRequest;
import com.tourism.rides.service.RideRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ride-requests")
@CrossOrigin(origins = "*")
public class RideRequestController {

    @Autowired
    private RideRequestService service;

    @GetMapping
    public List<RideRequest> getAll() {
        return service.getAllRequests();
    }

    @GetMapping("/{id}")
    public RideRequest getById(@PathVariable Long id) {
        return service.getRequestById(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<RideRequest> getByBooking(@PathVariable Long bookingId) {
        return service.getRequestsByBooking(bookingId);
    }

    @PostMapping
    public RideRequest create(@RequestBody RideRequest request) {
        return service.saveRequest(request);
    }

    @PutMapping("/{id}")
    public RideRequest update(@PathVariable Long id, @RequestBody RideRequest request) {
        request.setId(id);
        return service.saveRequest(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteRequest(id);
    }
}

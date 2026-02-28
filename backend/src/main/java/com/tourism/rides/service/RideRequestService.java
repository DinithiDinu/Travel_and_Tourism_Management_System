package com.tourism.rides.service;

import com.tourism.rides.entity.RideRequest;
import com.tourism.rides.repository.RideRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideRequestService {

    @Autowired
    private RideRequestRepository repository;

    public List<RideRequest> getAllRequests() {
        return repository.findAll();
    }

    public RideRequest getRequestById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<RideRequest> getRequestsByBooking(Long bookingId) {
        return repository.findByBookingId(bookingId);
    }

    public RideRequest saveRequest(RideRequest request) {
        if (request.getStatus() == null) {
            request.setStatus("Pending");
        }
        return repository.save(request);
    }

    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }
}

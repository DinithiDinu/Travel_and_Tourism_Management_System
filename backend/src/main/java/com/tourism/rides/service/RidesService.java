package com.tourism.rides.service;

import com.tourism.rides.entity.*;
import com.tourism.rides.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RidesService {

    @Autowired private ServiceRequestRepository requestRepo;
    @Autowired private RideRepository rideRepo;
    @Autowired private RideLocationRepository locationRepo;
    @Autowired private RiderProfileRepository riderProfileRepo;
    @Autowired private ServiceProviderRepository providerRepo;
    @Autowired private VehicleRepository vehicleRepo;
    @Autowired private AssignmentRepository assignmentRepo;

    // ── Service Requests ──
    public List<ServiceRequest> getAllRequests() { return requestRepo.findAll(); }
    public Optional<ServiceRequest> getRequestById(Long id) { return requestRepo.findById(id); }
    public List<ServiceRequest> getRequestsByUser(Long userId) { return requestRepo.findByUserId(userId); }
    public List<ServiceRequest> getRequestsByStatus(String status) { return requestRepo.findByStatus(status); }
    public ServiceRequest saveRequest(ServiceRequest r) { return requestRepo.save(r); }
    public void deleteRequest(Long id) { requestRepo.deleteById(id); }

    // ── Rides ──
    public List<Ride> getAllRides() { return rideRepo.findAll(); }
    public List<Ride> getRidesByRider(Long riderId) { return rideRepo.findByRiderId(riderId); }
    public Ride startRide(Ride ride) { return rideRepo.save(ride); }
    public Ride completeRide(Long rideId) {
        Ride ride = rideRepo.findById(rideId).orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setStatus("COMPLETED");
        ride.setEndTime(LocalDateTime.now());
        return rideRepo.save(ride);
    }
    public void deleteRide(Long id) { rideRepo.deleteById(id); }

    // ── Rider Profiles ──
    public List<RiderProfile> getAllRiders() { return riderProfileRepo.findAll(); }
    public Optional<RiderProfile> getRiderById(Long id) { return riderProfileRepo.findById(id); }
    public RiderProfile saveRider(RiderProfile r) { return riderProfileRepo.save(r); }
    public void deleteRider(Long id) { riderProfileRepo.deleteById(id); }

    // ── Service Providers ──
    public List<ServiceProvider> getAllProviders() { return providerRepo.findAll(); }
    public Optional<ServiceProvider> getProviderById(Long id) { return providerRepo.findById(id); }
    public ServiceProvider saveProvider(ServiceProvider p) { return providerRepo.save(p); }
    public void deleteProvider(Long id) { providerRepo.deleteById(id); }

    // ── Vehicles ──
    public List<Vehicle> getAllVehicles() { return vehicleRepo.findAll(); }
    public List<Vehicle> getVehiclesByRider(Long riderId) { return vehicleRepo.findByRiderId(riderId); }
    public Vehicle saveVehicle(Vehicle v) { return vehicleRepo.save(v); }
    public void deleteVehicle(Long id) { vehicleRepo.deleteById(id); }

    // ── Assignments ──
    public List<Assignment> getAllAssignments() { return assignmentRepo.findAll(); }
    public List<Assignment> getAssignmentsByRider(Long riderId) { return assignmentRepo.findByRiderId(riderId); }
    public Assignment saveAssignment(Assignment a) { return assignmentRepo.save(a); }
    public void deleteAssignment(Long id) { assignmentRepo.deleteById(id); }

    // ── Locations ──
    public List<RideLocation> getLocationsByRide(Long rideId) { return locationRepo.findByRideId(rideId); }
    public RideLocation saveLocation(RideLocation l) { return locationRepo.save(l); }
}

package com.tourism.rides.controller;

import com.tourism.rides.entity.*;
import com.tourism.rides.service.RidesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RidesController {

    @Autowired private RidesService service;

    // ── Service Requests ──
    @GetMapping("/requests")
    public List<ServiceRequest> getAllRequests() { return service.getAllRequests(); }

    @GetMapping("/requests/{id}")
    public ResponseEntity<?> getRequest(@PathVariable Long id) {
        return service.getRequestById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/requests/user/{userId}")
    public List<ServiceRequest> getByUser(@PathVariable Long userId) { return service.getRequestsByUser(userId); }

    @PostMapping("/requests")
    public ServiceRequest create(@RequestBody ServiceRequest r) { return service.saveRequest(r); }

    @PutMapping("/requests/{id}")
    public ServiceRequest update(@PathVariable Long id, @RequestBody ServiceRequest r) {
        r.setRequestId(id);
        return service.saveRequest(r);
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteRequest(id);
        return ResponseEntity.ok(Map.of("message", "Request deleted"));
    }

    // ── Rides ──
    @GetMapping
    public List<Ride> getAllRides() { return service.getAllRides(); }

    @GetMapping("/rider/{riderId}")
    public List<Ride> getByRider(@PathVariable Long riderId) { return service.getRidesByRider(riderId); }

    @PostMapping("/start")
    public Ride startRide(@RequestBody Ride ride) { return service.startRide(ride); }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeRide(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.completeRide(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRide(@PathVariable Long id) {
        service.deleteRide(id);
        return ResponseEntity.ok(Map.of("message", "Ride deleted"));
    }

    // ── Riders ──
    @GetMapping("/riders")
    public List<RiderProfile> getAllRiders() { return service.getAllRiders(); }

    @GetMapping("/riders/{id}")
    public ResponseEntity<?> getRider(@PathVariable Long id) {
        return service.getRiderById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/riders")
    public RiderProfile createRider(@RequestBody RiderProfile r) { return service.saveRider(r); }

    @PutMapping("/riders/{id}")
    public RiderProfile updateRider(@PathVariable Long id, @RequestBody RiderProfile r) {
        r.setRiderId(id);
        return service.saveRider(r);
    }

    @DeleteMapping("/riders/{id}")
    public ResponseEntity<?> deleteRider(@PathVariable Long id) {
        service.deleteRider(id);
        return ResponseEntity.ok(Map.of("message", "Rider deleted"));
    }

    // ── Vehicles ──
    @GetMapping("/vehicles")
    public List<Vehicle> getAllVehicles() { return service.getAllVehicles(); }

    @GetMapping("/vehicles/rider/{riderId}")
    public List<Vehicle> getVehiclesByRider(@PathVariable Long riderId) { return service.getVehiclesByRider(riderId); }

    @PostMapping("/vehicles")
    public Vehicle createVehicle(@RequestBody Vehicle v) { return service.saveVehicle(v); }

    @PutMapping("/vehicles/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle v) {
        v.setVehicleId(id);
        return service.saveVehicle(v);
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        service.deleteVehicle(id);
        return ResponseEntity.ok(Map.of("message", "Vehicle deleted"));
    }

    // ── Service Providers ──
    @GetMapping("/providers")
    public List<ServiceProvider> getAllProviders() { return service.getAllProviders(); }

    @PostMapping("/providers")
    public ServiceProvider createProvider(@RequestBody ServiceProvider p) { return service.saveProvider(p); }

    @PutMapping("/providers/{id}")
    public ServiceProvider updateProvider(@PathVariable Long id, @RequestBody ServiceProvider p) {
        p.setServiceProviderId(id);
        return service.saveProvider(p);
    }

    @DeleteMapping("/providers/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable Long id) {
        service.deleteProvider(id);
        return ResponseEntity.ok(Map.of("message", "Provider deleted"));
    }

    // ── Assignments ──
    @GetMapping("/assignments")
    public List<Assignment> getAllAssignments() { return service.getAllAssignments(); }

    @GetMapping("/assignments/rider/{riderId}")
    public List<Assignment> getAssignmentsByRider(@PathVariable Long riderId) { return service.getAssignmentsByRider(riderId); }

    @PostMapping("/assignments")
    public Assignment createAssignment(@RequestBody Assignment a) { return service.saveAssignment(a); }

    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        service.deleteAssignment(id);
        return ResponseEntity.ok(Map.of("message", "Assignment deleted"));
    }

    // ── Locations ──
    @GetMapping("/{rideId}/locations")
    public List<RideLocation> getLocations(@PathVariable Long rideId) { return service.getLocationsByRide(rideId); }

    @PostMapping("/locations")
    public RideLocation createLocation(@RequestBody RideLocation l) { return service.saveLocation(l); }
}

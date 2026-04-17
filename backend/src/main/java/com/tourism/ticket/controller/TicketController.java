package com.tourism.ticket.controller;

import com.tourism.ticket.entity.Ticket;
import com.tourism.ticket.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin

public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Create ticket (Traveler)
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // Get all tickets (Admin)
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

     //  Get tickets by user
    @GetMapping("/user/{userId}")
    public List<Ticket> getTicketsByUser(@PathVariable Long userId) {
        return ticketService.getTicketsByUser(userId);
    }

    //  Update status (Admin)
    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ticketService.updateStatus(id, status);
    }

    // Add admin response
    @PutMapping("/{id}/response")
    public Ticket addResponse(@PathVariable Long id, @RequestParam String response) {
        return ticketService.addResponse(id, response);
    }
}

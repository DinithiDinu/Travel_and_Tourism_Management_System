package com.tourism.ticket.service;

import com.tourism.ticket.entity.Ticket;
import com.tourism.ticket.repository.TicketRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // create a ticket
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(java.util.Objects.requireNonNull(ticket, "Ticket cannot be null"));
    }

    // Get all tickets (admin)
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get tickets by user
    public List<Ticket> getTicketsByUser(Long userId) {
        return ticketRepository.findByUserId(userId);
    }

    // Update status
    public Ticket updateStatus(Long ticketId, String status) {
        if (ticketId == null) throw new IllegalArgumentException("Ticket ID cannot be null");
        Ticket ticket = ticketRepository.findById(ticketId.longValue()).orElseThrow();
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    // add admin response
    public Ticket addResponse(Long ticketId, String response) {
        if (ticketId == null) throw new IllegalArgumentException("Ticket ID cannot be null");
        Ticket ticket = ticketRepository.findById(ticketId.longValue()).orElseThrow();
        ticket.setAdminResponse(response);
        return ticketRepository.save(ticket);
    }
}

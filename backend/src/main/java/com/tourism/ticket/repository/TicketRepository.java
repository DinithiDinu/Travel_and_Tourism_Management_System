package com.tourism.ticket.repository;

import com.tourism.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    //get tickets by user
    List<Ticket> findByUserId(Long userId);


    // get tickets by status
    List<Ticket> findByStatus(String status);

} 
    

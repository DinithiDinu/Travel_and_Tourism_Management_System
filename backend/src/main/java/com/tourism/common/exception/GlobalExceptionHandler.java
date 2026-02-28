package com.tourism.common.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles FK / unique-constraint violations (e.g. referencing a riderId that
     * does not exist in rider_profiles) and returns 409 Conflict with a friendly
     * message instead of a cryptic empty 403.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String msg = ex.getMostSpecificCause().getMessage();

        // Produce a human-readable message for common constraint types
        if (msg != null) {
            if (msg.contains("rider_id") || msg.contains("rider_profiles")) {
                msg = "The specified Rider ID does not exist. Please select a valid rider.";
            } else if (msg.contains("unique") || msg.contains("duplicate") || msg.contains("Unique")) {
                msg = "A record with the same unique value already exists.";
            } else if (msg.contains("foreign key") || msg.contains("violates foreign key")) {
                msg = "A referenced record does not exist. Please check your input values.";
            } else if (msg.contains("not-null") || msg.contains("null value")) {
                msg = "A required field is missing.";
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", msg != null ? msg : "Data integrity violation"));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage() != null ? ex.getMessage() : "Record not found"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage() != null ? ex.getMessage() : "Invalid argument"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred"));
    }
}

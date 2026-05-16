package com.systeme_absence.dto;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private String role;
    private String message;

    // Constructeur login (sans message)
    public AuthResponseDTO(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Constructeur register (avec message)
    public AuthResponseDTO(String token, String role, String message) {
        this.token = token;
        this.role = role;
        this.message = message;
    }
}

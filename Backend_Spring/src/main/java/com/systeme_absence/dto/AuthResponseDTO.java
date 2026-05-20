package com.systeme_absence.dto;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private String role;
    private String message;
    private Long userId;

    // Constructeur login (sans message)
    public AuthResponseDTO(String token, String role, Long userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    // Constructeur register (avec message)
    public AuthResponseDTO(String token, String role, Long userId, String message) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.message = message;
    }
}

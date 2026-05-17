package com.systeme_absence.dto;

import lombok.Data;

@Data
public class SessionRequestDTO {
    private String subject;
    private Long teacherId;
    // Durée en minutes (ex: 90)
    private int durationMinutes;
}

package com.systeme_absence.dto;

import com.systeme_absence.entities.Session.SessionStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionResponseDTO {
    private Long id;
    private String subject;
    private String code;
    private String teacherName;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private SessionStatus status;
}

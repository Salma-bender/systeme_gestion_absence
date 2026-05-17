package com.systeme_absence.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AttendanceDTO {
    private Long id;
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private Long sessionId;
    private String sessionSubject;
    private String sessionCode;
    private LocalDateTime detectedAt;
}

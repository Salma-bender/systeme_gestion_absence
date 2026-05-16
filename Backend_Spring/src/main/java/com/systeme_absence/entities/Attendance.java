package com.systeme_absence.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendances")
@Data
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence à l'étudiant détecté
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    // Date/heure de la détection
    private LocalDateTime detectedAt;
}

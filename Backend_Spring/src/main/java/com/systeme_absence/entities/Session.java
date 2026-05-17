package com.systeme_absence.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nom de la matière
    private String subject;

    // Code unique généré automatiquement (ex: A1B2C3)
    @Column(unique = true, nullable = false)
    private String code;

    // Professeur qui a créé la séance
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // Date/heure de création
    private LocalDateTime createdAt;

    // Date/heure d'expiration (durée limitée)
    private LocalDateTime expiresAt;

    // Statut : ACTIVE ou CLOSED
    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    public enum SessionStatus {
        ACTIVE, CLOSED
    }
}

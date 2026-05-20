package com.systeme_absence.services;

import com.systeme_absence.dto.SessionRequestDTO;
import com.systeme_absence.dto.SessionResponseDTO;
import com.systeme_absence.entities.Session;
import com.systeme_absence.entities.Session.SessionStatus;
import com.systeme_absence.entities.Teacher;
import com.systeme_absence.repositories.SessionRepository;
import com.systeme_absence.repositories.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // ==========================================
    // CRÉER UNE SÉANCE
    // ==========================================
    public SessionResponseDTO createSession(SessionRequestDTO dto) {
        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));

        Session session = new Session();
        session.setSubject(dto.getSubject());
        session.setCode(generateUniqueCode());
        session.setTeacher(teacher);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusMinutes(dto.getDurationMinutes()));
        session.setStatus(SessionStatus.ACTIVE);

        return toDTO(sessionRepository.save(session));
    }

    // ==========================================
    // VALIDER UN CODE DE SÉANCE
    // ==========================================
    public SessionResponseDTO validateCode(String code) {
        Session session = sessionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Code de séance invalide"));

        if (session.getStatus() == SessionStatus.CLOSED) {
            throw new RuntimeException("Cette séance est fermée");
        }

        if (LocalDateTime.now().isAfter(session.getExpiresAt())) {
            // Fermer automatiquement si expirée
            session.setStatus(SessionStatus.CLOSED);
            sessionRepository.save(session);
            throw new RuntimeException("Cette séance a expiré");
        }

        return toDTO(session);
    }

    // ==========================================
    // LISTE DES SÉANCES
    // ==========================================
    public List<SessionResponseDTO> getAllSessions() {
        return sessionRepository.findAll()
                .stream()
                .map(session -> {
                    // Auto-expire sessions that have passed their expiry time
                    if (session.getStatus() == SessionStatus.ACTIVE &&
                        LocalDateTime.now().isAfter(session.getExpiresAt())) {
                        session.setStatus(SessionStatus.CLOSED);
                        sessionRepository.save(session);
                    }
                    return toDTO(session);
                })
                .collect(Collectors.toList());
    }

    public List<SessionResponseDTO> getSessionsByTeacher(Long teacherId) {
        return sessionRepository.findByTeacherId(teacherId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ==========================================
    // DÉTAILS D'UNE SÉANCE
    // ==========================================
    public SessionResponseDTO getSessionById(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance introuvable"));
        return toDTO(session);
    }

    // ==========================================
    // FERMER UNE SÉANCE
    // ==========================================
    public SessionResponseDTO closeSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Séance introuvable"));
        session.setStatus(SessionStatus.CLOSED);
        return toDTO(sessionRepository.save(session));
    }

    // ==========================================
    // GÉNÉRATION CODE UNIQUE (ex: A1B2C3)
    // ==========================================
    private String generateUniqueCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            code = sb.toString();
        } while (sessionRepository.existsByCode(code));
        return code;
    }

    // ==========================================
    // MAPPER Entity → DTO
    // ==========================================
    private SessionResponseDTO toDTO(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setId(session.getId());
        dto.setSubject(session.getSubject());
        dto.setCode(session.getCode());
        dto.setTeacherName(session.getTeacher() != null ? session.getTeacher().getName() : "");
        dto.setCreatedAt(session.getCreatedAt());
        dto.setExpiresAt(session.getExpiresAt());
        dto.setStatus(session.getStatus());
        return dto;
    }
}

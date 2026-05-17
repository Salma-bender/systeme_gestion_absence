package com.systeme_absence.services;

import com.systeme_absence.dto.AttendanceDTO;
import com.systeme_absence.entities.Attendance;
import com.systeme_absence.entities.Session;
import com.systeme_absence.entities.Session.SessionStatus;
import com.systeme_absence.entities.Student;
import com.systeme_absence.repositories.AttendanceRepository;
import com.systeme_absence.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private StudentService studentService;

    // ==========================================
    // ENREGISTRER PRÉSENCES (avec vérifications)
    // ==========================================

    /**
     * Enregistre les présences pour une séance donnée.
     * Vérifie : séance valide + active, présence pas déjà marquée.
     */
    public List<AttendanceDTO> saveAttendancesForSession(Long sessionId, List<Integer> studentIds) {
        // Vérification séance valide
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Séance introuvable : " + sessionId));

        // Vérification séance active
        if (session.getStatus() == SessionStatus.CLOSED) {
            throw new RuntimeException("La séance est fermée");
        }
        if (LocalDateTime.now().isAfter(session.getExpiresAt())) {
            session.setStatus(SessionStatus.CLOSED);
            sessionRepository.save(session);
            throw new RuntimeException("La séance a expiré");
        }

        List<AttendanceDTO> recorded = new ArrayList<>();
        for (Integer id : studentIds) {
            Student student = studentService.findById(Long.valueOf(id));
            if (student == null) continue;

            // Vérification présence déjà marquée
            if (attendanceRepository.existsByStudentIdAndSessionId(student.getId(), sessionId)) {
                continue; // déjà enregistré, on skip silencieusement
            }

            Attendance attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setSession(session);
            attendance.setDetectedAt(LocalDateTime.now());
            recorded.add(toDTO(attendanceRepository.save(attendance)));
        }
        return recorded;
    }

    /**
     * Ancienne méthode sans session (compatibilité).
     */
    public List<Attendance> saveAttendancesForIds(List<Integer> studentIds) {
        List<Attendance> recorded = new ArrayList<>();
        for (Integer id : studentIds) {
            Student student = studentService.findById(Long.valueOf(id));
            if (student != null) {
                Attendance attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setDetectedAt(LocalDateTime.now());
                recorded.add(attendanceRepository.save(attendance));
            }
        }
        return recorded;
    }

    // ==========================================
    // LECTURE
    // ==========================================

    public List<AttendanceDTO> getAllAttendancesDTO() {
        return attendanceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendancesBySession(Long sessionId) {
        return attendanceRepository.findBySessionId(sessionId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendancesByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    // ==========================================
    // MAPPER
    // ==========================================

    private AttendanceDTO toDTO(Attendance a) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(a.getId());
        dto.setDetectedAt(a.getDetectedAt());
        if (a.getStudent() != null) {
            dto.setStudentId(a.getStudent().getId());
            dto.setStudentFirstName(a.getStudent().getFirstName());
            dto.setStudentLastName(a.getStudent().getLastName());
        }
        if (a.getSession() != null) {
            dto.setSessionId(a.getSession().getId());
            dto.setSessionSubject(a.getSession().getSubject());
            dto.setSessionCode(a.getSession().getCode());
        }
        return dto;
    }
}

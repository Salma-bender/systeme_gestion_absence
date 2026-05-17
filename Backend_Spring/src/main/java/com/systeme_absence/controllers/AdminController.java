package com.systeme_absence.controllers;

import com.systeme_absence.dto.DashboardStatsDTO;
import com.systeme_absence.entities.Session.SessionStatus;
import com.systeme_absence.entities.Teacher;
import com.systeme_absence.repositories.AttendanceRepository;
import com.systeme_absence.repositories.SessionRepository;
import com.systeme_absence.repositories.StudentRepository;
import com.systeme_absence.services.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Endpoints réservés aux administrateurs.
 * Sécurisés par SecurityConfig : /api/admin/** → ROLE_ADMIN uniquement.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private SessionRepository sessionRepository;

    // ==========================================
    // GESTION DES ENSEIGNANTS
    // ==========================================

    /**
     * GET /api/admin/teachers
     * Retourne la liste de tous les enseignants.
     */
    @GetMapping("/teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    /**
     * POST /api/admin/teachers
     * Crée un nouvel enseignant.
     * Body JSON: { "name": "...", "email": "...", "password": "..." }
     */
    @PostMapping("/teachers")
    public ResponseEntity<Teacher> createTeacher(@RequestBody Teacher teacher) {
        return ResponseEntity.ok(teacherService.createTeacher(teacher));
    }

    /**
     * DELETE /api/admin/teachers/{id}
     * Supprime un enseignant par son identifiant.
     */
    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // STATISTIQUES DU TABLEAU DE BORD
    // ==========================================

    /**
     * GET /api/admin/stats
     * Retourne les statistiques globales pour le tableau de bord.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO(
            studentRepository.count(),
            sessionRepository.countByStatus(SessionStatus.ACTIVE),
            attendanceRepository.count(),
            sessionRepository.count()
        );
        return ResponseEntity.ok(stats);
    }
}

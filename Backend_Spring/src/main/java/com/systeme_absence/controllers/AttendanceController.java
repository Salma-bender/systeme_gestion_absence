package com.systeme_absence.controllers;

import com.systeme_absence.dto.AttendanceDTO;
import com.systeme_absence.entities.Student;
import com.systeme_absence.services.AttendanceService;
import com.systeme_absence.services.AIService;
import com.systeme_absence.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AIService aiService;

    @Autowired
    private StudentService studentService;

    /**
     * POST /attendance/detect
     * Détecte les étudiants dans l'image SANS enregistrer en base.
     */
    @PostMapping("/detect")
    public ResponseEntity<?> detectOnly(@RequestParam("image") MultipartFile image) {
        try {
            List<String> detectedIds = aiService.scanClassroom(image);
            List<Map<String, Object>> result = new ArrayList<>();
            for (String idStr : detectedIds) {
                try {
                    Student s = studentService.findById(Long.valueOf(idStr));
                    if (s != null) {
                        Map<String, Object> entry = new HashMap<>();
                        entry.put("id", s.getId());
                        entry.put("firstName", s.getFirstName());
                        entry.put("lastName", s.getLastName());
                        result.add(entry);
                    }
                } catch (NumberFormatException ignored) {}
            }
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * POST /attendance/scan
     * Enregistre les présences sans session (ancienne API).
     * Body: { "studentIds": [1, 2, 3] }
     */
    @PostMapping("/scan")
    public ResponseEntity<?> saveAttendances(@RequestBody Map<String, List<Integer>> body) {
        try {
            List<Integer> ids = body.get("studentIds");
            return ResponseEntity.ok(attendanceService.saveAttendancesForIds(ids));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * POST /attendance/session/{sessionId}
     * Enregistre les présences liées à une séance.
     * Vérifie : séance valide, active, présence pas déjà marquée.
     * Body: { "studentIds": [1, 2, 3] }
     */
    @PostMapping("/session/{sessionId}")
    public ResponseEntity<?> saveAttendancesForSession(
            @PathVariable Long sessionId,
            @RequestBody Map<String, List<Integer>> body) {
        try {
            List<Integer> ids = body.get("studentIds");
            List<AttendanceDTO> saved = attendanceService.saveAttendancesForSession(sessionId, ids);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /attendance
     * Toutes les présences (avec infos étudiant + séance).
     */
    @GetMapping
    public ResponseEntity<List<AttendanceDTO>> getAllAttendances() {
        return ResponseEntity.ok(attendanceService.getAllAttendancesDTO());
    }

    /**
     * GET /attendance/session/{sessionId}
     * Présences d'une séance spécifique.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<AttendanceDTO>> getBySession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(attendanceService.getAttendancesBySession(sessionId));
    }

    /**
     * GET /attendance/student/{studentId}
     * Historique des présences d'un étudiant.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendancesByStudent(studentId));
    }
}

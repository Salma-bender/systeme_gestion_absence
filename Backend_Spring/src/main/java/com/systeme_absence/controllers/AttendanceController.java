package com.systeme_absence.controllers;

import com.systeme_absence.entities.Attendance;
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
     * Utilisé par le scan continu React Native (chaque seconde).
     * Retourne : [{ id, firstName, lastName }, ...]
     */
    @PostMapping("/detect")
    public ResponseEntity<?> detectOnly(@RequestParam("image") MultipartFile image) {
        try {
            System.out.println("[DETECT] Image reçue : " + image.getSize() + " bytes");

            List<String> detectedIds = aiService.scanClassroom(image);
            System.out.println("[DETECT] IDs détectés par AI : " + detectedIds);

            List<Map<String, Object>> result = new ArrayList<>();
            for (String idStr : detectedIds) {
                try {
                    Student s = studentService.findById(Long.parseLong(idStr));
                    if (s != null) {
                        Map<String, Object> entry = new HashMap<>();
                        entry.put("id", s.getId());
                        entry.put("firstName", s.getFirstName());
                        entry.put("lastName", s.getLastName());
                        result.add(entry);
                    }
                } catch (NumberFormatException ignored) {}
            }

            System.out.println("[DETECT] Résultat final : " + result);
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            System.err.println("[DETECT] Erreur : " + e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * POST /attendance/scan
     * Enregistre les présences finales en base depuis une liste d'IDs.
     * Appelé une seule fois quand le professeur clique "Arrêter".
     * Body JSON : { "studentIds": [1, 2, 3] }
     */
    @PostMapping("/scan")
    public ResponseEntity<?> saveAttendances(@RequestBody Map<String, List<Integer>> body) {
        try {
            List<Integer> ids = body.get("studentIds");
            System.out.println("[SCAN] Enregistrement présences pour IDs : " + ids);

            List<Attendance> saved = attendanceService.saveAttendancesForIds(ids);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            System.err.println("[SCAN] Erreur : " + e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /attendance
     * Retourne toutes les présences enregistrées.
     */
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendances() {
        return ResponseEntity.ok(attendanceService.getAllAttendances());
    }

    /**
     * POST /attendance/manual
     * Ajoute manuellement une présence pour un étudiant.
     * Body JSON : { "studentId": 1 }
     */
    @PostMapping("/manual")
    public ResponseEntity<?> addManual(@RequestBody Map<String, Long> body) {
        try {
            Long studentId = body.get("studentId");
            Student student = studentService.findById(studentId);
            if (student == null) return ResponseEntity.badRequest().body("Étudiant introuvable");
            Attendance saved = attendanceService.addManualAttendance(student);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * DELETE /attendance/{id}
     * Supprime une présence par son ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        try {
            attendanceService.deleteAttendance(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }
}

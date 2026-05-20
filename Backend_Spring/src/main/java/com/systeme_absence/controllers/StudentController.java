package com.systeme_absence.controllers;

import com.systeme_absence.entities.Attendance;
import com.systeme_absence.entities.Student;
import com.systeme_absence.repositories.AttendanceRepository;
import com.systeme_absence.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    /**
     * GET /api/student/me
     * Retourne le profil de l'étudiant connecté.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Principal principal) {
        return studentRepository.findByEmail(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/student/my-attendances
     * Retourne toutes les présences de l'étudiant connecté.
     */
    @GetMapping("/my-attendances")
    public ResponseEntity<List<Attendance>> getMyAttendances(Principal principal) {
        Student student = studentRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        List<Attendance> attendances = attendanceRepository.findByStudentId(student.getId());
        return ResponseEntity.ok(attendances);
    }
}

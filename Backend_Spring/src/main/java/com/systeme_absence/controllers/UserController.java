package com.systeme_absence.controllers;

import com.systeme_absence.entities.Student;
import com.systeme_absence.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/students")
public class UserController {

    @Autowired
    private StudentService studentService;

    /**
     * POST /students
     * Crée un étudiant et enregistre son visage dans l'API AI.
     * Body: multipart/form-data { firstName, lastName, image }
     */
    @PostMapping
    public ResponseEntity<?> createStudent(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("image") MultipartFile image) {
        try {
            Student student = studentService.createStudent(firstName, lastName, image);
            return ResponseEntity.ok(student);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'enregistrement: " + e.getMessage());
        }
    }

    /**
     * GET /students
     * Retourne la liste de tous les étudiants.
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
}

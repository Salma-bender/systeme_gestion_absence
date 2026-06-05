package com.systeme_absence.services;

import com.systeme_absence.entities.Student;
import com.systeme_absence.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AIService aiService;

    /**
     * Crée un étudiant, le sauvegarde en base, puis envoie son image à l'API AI.
     */
    public Student createStudent(String firstName, String lastName, MultipartFile image) throws IOException {
        // 1. Sauvegarder l'étudiant en base
        Student student = new Student();
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setPhotoPath(image.getOriginalFilename());
        Student saved = studentRepository.save(student);

        // 2. Envoyer l'image à l'API AI (optionnel — ne bloque pas si AI indisponible)
        try {
            Map<String, Object> aiResult = aiService.registerFace(String.valueOf(saved.getId()), image);
            System.out.println("AI register-face result: " + aiResult);
        } catch (Exception e) {
            System.out.println("AI API indisponible, étudiant sauvegardé sans embedding: " + e.getMessage());
        }

        return saved;
    }

    /**
     * Retourne tous les étudiants.
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Trouve un étudiant par son ID.
     */
    public Student findById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }
}

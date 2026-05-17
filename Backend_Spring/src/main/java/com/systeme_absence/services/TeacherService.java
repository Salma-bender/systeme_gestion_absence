package com.systeme_absence.services;

import com.systeme_absence.entities.Teacher;
import com.systeme_absence.repositories.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Retourne la liste de tous les enseignants.
     */
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    /**
     * Crée un nouvel enseignant en encodant son mot de passe avec BCrypt.
     */
    public Teacher createTeacher(Teacher teacher) {
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        return teacherRepository.save(teacher);
    }

    /**
     * Supprime un enseignant par son identifiant.
     */
    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }
}

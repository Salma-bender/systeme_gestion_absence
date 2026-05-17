package com.systeme_absence.config;

import com.systeme_absence.entities.Admin;
import com.systeme_absence.entities.Teacher;
import com.systeme_absence.repositories.AdminRepository;
import com.systeme_absence.repositories.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Insère les données de test au démarrage si elles n'existent pas.
 * Le mot de passe est encodé avec le vrai BCryptPasswordEncoder.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Créer admin de test si inexistant
        if (adminRepository.findByEmail("admin@test.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setName("Administrateur");
            adminRepository.save(admin);
            System.out.println(">>> Admin créé : admin@test.com / 123456");
        } else {
            // Forcer la mise à jour du mot de passe avec le bon hash
            Admin admin = adminRepository.findByEmail("admin@test.com").get();
            admin.setPassword(passwordEncoder.encode("123456"));
            adminRepository.save(admin);
            System.out.println(">>> Admin mis à jour : admin@test.com / 123456");
        }

        // Créer teacher de test si inexistant
        if (teacherRepository.findByEmail("teacher@test.com").isEmpty()) {
            Teacher teacher = new Teacher();
            teacher.setEmail("teacher@test.com");
            teacher.setPassword(passwordEncoder.encode("123456"));
            teacher.setName("Professeur Test");
            teacherRepository.save(teacher);
            System.out.println(">>> Teacher créé : teacher@test.com / 123456");
        } else {
            Teacher teacher = teacherRepository.findByEmail("teacher@test.com").get();
            teacher.setPassword(passwordEncoder.encode("123456"));
            teacherRepository.save(teacher);
            System.out.println(">>> Teacher mis à jour : teacher@test.com / 123456");
        }
    }
}

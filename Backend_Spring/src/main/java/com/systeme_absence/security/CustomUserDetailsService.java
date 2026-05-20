package com.systeme_absence.security;

import com.systeme_absence.entities.Admin;
import com.systeme_absence.entities.Student;
import com.systeme_absence.entities.Teacher;
import com.systeme_absence.repositories.AdminRepository;
import com.systeme_absence.repositories.StudentRepository;
import com.systeme_absence.repositories.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 1. Admin
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return new User(admin.get().getEmail(), admin.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        // 2. Teacher
        Optional<Teacher> teacher = teacherRepository.findByEmail(email);
        if (teacher.isPresent()) {
            return new User(teacher.get().getEmail(), teacher.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_TEACHER")));
        }

        // 3. Student
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            return new User(student.get().getEmail(), student.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));
        }

        throw new UsernameNotFoundException("Utilisateur non trouvé : " + email);
    }
}

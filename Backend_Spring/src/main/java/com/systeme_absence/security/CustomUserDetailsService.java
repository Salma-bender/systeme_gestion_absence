package com.systeme_absence.security;

import com.systeme_absence.entities.Admin;
import com.systeme_absence.entities.Teacher;
import com.systeme_absence.repositories.AdminRepository;
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

    /**
     * Cherche d'abord dans les admins, puis dans les teachers.
     * Le username est l'email.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Vérifier si c'est un admin
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return new User(
                    admin.get().getEmail(),
                    admin.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // Vérifier si c'est un teacher
        Optional<Teacher> teacher = teacherRepository.findByEmail(email);
        if (teacher.isPresent()) {
            return new User(
                    teacher.get().getEmail(),
                    teacher.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_TEACHER"))
            );
        }

        throw new UsernameNotFoundException("Utilisateur non trouvé : " + email);
    }
}

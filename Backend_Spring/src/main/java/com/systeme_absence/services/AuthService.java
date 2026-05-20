package com.systeme_absence.services;

import com.systeme_absence.dto.AuthResponseDTO;
import com.systeme_absence.dto.LoginDTO;
import com.systeme_absence.dto.RegisterDTO;
import com.systeme_absence.entities.Admin;
import com.systeme_absence.entities.Teacher;
import com.systeme_absence.repositories.AdminRepository;
import com.systeme_absence.repositories.TeacherRepository;
import com.systeme_absence.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AdminRepository adminRepository;
    private final TeacherRepository teacherRepository;

    /** Authentifie l'utilisateur et retourne un JWT avec son rôle */
    public AuthResponseDTO login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("UNKNOWN")
                .replace("ROLE_", "");

        String email = loginDTO.getEmail().trim().toLowerCase();
        String token = jwtService.generateToken(email, role);

        // Récupérer l'ID de l'utilisateur selon son rôle
        Long userId = null;
        if (role.equals("ADMIN")) {
            userId = adminRepository.findByEmail(email).map(a -> a.getId()).orElse(null);
        } else if (role.equals("TEACHER")) {
            userId = teacherRepository.findByEmail(email).map(t -> t.getId()).orElse(null);
        }

        return new AuthResponseDTO(token, role, userId);
    }

    /**
     * Inscrit un nouvel utilisateur (ADMIN ou TEACHER).
     * Vérifie l'unicité de l'email, encode le mot de passe,
     * sauvegarde en base et retourne un JWT.
     */
    public AuthResponseDTO register(RegisterDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();
        String role = dto.getRole().toUpperCase();

        // Valider le rôle
        if (!role.equals("ADMIN") && !role.equals("TEACHER")) {
            throw new IllegalArgumentException("Rôle invalide. Utilisez ADMIN ou TEACHER.");
        }

        // Vérifier unicité email dans les deux tables
        if (adminRepository.findByEmail(email).isPresent() ||
            teacherRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // Sauvegarder selon le rôle
        try {
            if (role.equals("ADMIN")) {
                Admin admin = new Admin();
                admin.setEmail(email);
                admin.setPassword(encodedPassword);
                admin.setName(dto.getName());
                adminRepository.save(admin);
            } else {
                Teacher teacher = new Teacher();
                teacher.setEmail(email);
                teacher.setPassword(encodedPassword);
                teacher.setName(dto.getName());
                teacherRepository.save(teacher);
            }
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        // Générer JWT directement après inscription
        String token = jwtService.generateToken(email, role);

        // Récupérer l'ID du nouvel utilisateur
        Long userId = null;
        if (role.equals("ADMIN")) {
            userId = adminRepository.findByEmail(email).map(a -> a.getId()).orElse(null);
        } else {
            userId = teacherRepository.findByEmail(email).map(t -> t.getId()).orElse(null);
        }

        return new AuthResponseDTO(token, role, userId, "Compte créé avec succès");
    }
}

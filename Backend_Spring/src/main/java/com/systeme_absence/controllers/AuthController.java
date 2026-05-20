package com.systeme_absence.controllers;

import com.systeme_absence.dto.AuthResponseDTO;
import com.systeme_absence.dto.LoginDTO;
import com.systeme_absence.dto.RegisterDTO;
import com.systeme_absence.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * Body: { "email": "admin@test.com", "password": "123456" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            AuthResponseDTO response = authService.login(loginDTO);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
        }
    }

    /**
     * POST /api/auth/register
     * Body: { "name": "John", "email": "john@test.com", "password": "123456", "role": "TEACHER" }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        try {
            AuthResponseDTO response = authService.register(registerDTO);
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            // Email déjà utilisé ou rôle invalide → 400
            return ResponseEntity.status(400).body(java.util.Map.of("error", e.getMessage()));
        }
    }
}

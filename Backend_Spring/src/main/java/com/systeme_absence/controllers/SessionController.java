package com.systeme_absence.controllers;

import com.systeme_absence.dto.SessionRequestDTO;
import com.systeme_absence.dto.SessionResponseDTO;
import com.systeme_absence.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    /**
     * POST /api/session
     * Créer une nouvelle séance avec génération automatique du code.
     */
    @PostMapping
    public ResponseEntity<SessionResponseDTO> createSession(@RequestBody SessionRequestDTO dto) {
        return ResponseEntity.ok(sessionService.createSession(dto));
    }

    /**
     * GET /api/session
     * Liste toutes les séances.
     */
    @GetMapping
    public ResponseEntity<List<SessionResponseDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    /**
     * GET /api/session/{id}
     * Détails d'une séance par ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessionResponseDTO> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    /**
     * GET /api/session/teacher/{teacherId}
     * Séances d'un professeur spécifique.
     */
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<SessionResponseDTO>> getByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(sessionService.getSessionsByTeacher(teacherId));
    }

    /**
     * POST /api/session/validate
     * Valider un code de séance (utilisé par l'app mobile).
     * Body: { "code": "A1B2C3" }
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateCode(@RequestBody java.util.Map<String, String> body) {
        try {
            String code = body.get("code");
            return ResponseEntity.ok(sessionService.validateCode(code));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PUT /api/session/{id}/close
     * Fermer une séance manuellement.
     */
    @PutMapping("/{id}/close")
    public ResponseEntity<SessionResponseDTO> closeSession(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.closeSession(id));
    }
}

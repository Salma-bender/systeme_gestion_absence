package com.systeme_absence.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${ai.api.url}")
    private String aiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Envoie l'image d'un étudiant à l'API AI pour enregistrer son embedding facial.
     * POST /register-face?student_id={id}
     */
    public Map<String, Object> registerFace(String studentId, MultipartFile image) throws IOException {
        // Sauvegarder temporairement le fichier
        File tempFile = File.createTempFile("student_", ".jpg");
        image.transferTo(tempFile);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(tempFile));

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            String url = aiApiUrl + "/register-face?student_id=" + studentId;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            return response.getBody();
        } finally {
            tempFile.delete();
        }
    }

    /**
     * Envoie l'image de la classe à l'API AI pour détecter les étudiants présents.
     * POST /scan-classroom
     * Retourne { "success": true, "detectedStudents": ["1","2"] }
     */
    @SuppressWarnings("unchecked")
    public List<String> scanClassroom(MultipartFile image) throws IOException {
        File tempFile = File.createTempFile("classroom_", ".jpg");
        image.transferTo(tempFile);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(tempFile));

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            String url = aiApiUrl + "/scan-classroom";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            Map<String, Object> result = response.getBody();
            if (result != null && Boolean.TRUE.equals(result.get("success"))) {
                return (List<String>) result.get("detectedStudents");
            }
            return List.of();
        } finally {
            tempFile.delete();
        }
    }
}

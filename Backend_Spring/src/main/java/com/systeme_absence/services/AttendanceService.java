package com.systeme_absence.services;

import com.systeme_absence.entities.Attendance;
import com.systeme_absence.entities.Student;
import com.systeme_absence.repositories.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private StudentService studentService;

    /**
     * Enregistre les présences en base depuis une liste d'IDs étudiants.
     * Appelé une seule fois à la fin du scan.
     */
    public List<Attendance> saveAttendancesForIds(List<Integer> studentIds) {
        List<Attendance> recorded = new ArrayList<>();
        for (Integer id : studentIds) {
            Student student = studentService.findById(Long.valueOf(id));
            if (student != null) {
                Attendance attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setDetectedAt(LocalDateTime.now());
                recorded.add(attendanceRepository.save(attendance));
            }
        }
        return recorded;
    }

    /**
     * Retourne toutes les présences enregistrées.
     */
    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }
}

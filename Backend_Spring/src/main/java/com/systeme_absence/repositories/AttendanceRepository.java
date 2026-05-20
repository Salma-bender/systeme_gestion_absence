package com.systeme_absence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.systeme_absence.entities.Attendance;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
}

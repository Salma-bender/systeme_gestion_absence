package com.systeme_absence.repositories;

import com.systeme_absence.entities.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findBySessionId(Long sessionId);

    List<Attendance> findByStudentId(Long studentId);

    boolean existsByStudentIdAndSessionId(Long studentId, Long sessionId);

    Optional<Attendance> findByStudentIdAndSessionId(Long studentId, Long sessionId);
}

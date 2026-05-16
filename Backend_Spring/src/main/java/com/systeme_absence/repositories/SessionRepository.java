package com.systeme_absence.repositories;

import com.systeme_absence.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findByCode(String code);

    List<Session> findByTeacherId(Long teacherId);

    boolean existsByCode(String code);

    long countByStatus(Session.SessionStatus status);
}

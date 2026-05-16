package com.systeme_absence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.systeme_absence.entities.Session;

public interface SessionRepository extends JpaRepository<Session, Long> {

}

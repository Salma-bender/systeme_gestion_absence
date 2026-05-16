package com.systeme_absence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.systeme_absence.entities.Student;;

public interface StudentRepository extends JpaRepository<Student, Long> {

}

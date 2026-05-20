package com.systeme_absence.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "students")
@Data
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    // URL ou chemin de la photo stockée
    private String photoPath;

    // Authentification étudiant
    @Column(unique = true)
    private String email;

    private String password;
}

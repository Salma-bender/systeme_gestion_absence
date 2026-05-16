-- ============================================================
-- Script d'initialisation de la base de données
-- Système de Gestion de Présence
-- Exécuter dans MySQL Workbench avec user: root / pwd: 1234
-- ============================================================

-- Créer la base si elle n'existe pas
CREATE DATABASE IF NOT EXISTS systeme_absence
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE systeme_absence;

-- ============================================================
-- Table admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name     VARCHAR(255)
);

-- ============================================================
-- Table teachers
-- ============================================================
CREATE TABLE IF NOT EXISTS teachers (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name     VARCHAR(255)
);

-- ============================================================
-- Données de test
-- Mot de passe "123456" hashé avec BCrypt
-- ============================================================

-- Admin de test : admin@test.com / 123456
INSERT INTO admins (email, password, name)
SELECT 'admin@test.com',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
       'Administrateur'
WHERE NOT EXISTS (
    SELECT 1 FROM admins WHERE email = 'admin@test.com'
);

-- Teacher de test : teacher@test.com / 123456
INSERT INTO teachers (email, password, name)
SELECT 'teacher@test.com',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
       'Professeur Test'
WHERE NOT EXISTS (
    SELECT 1 FROM teachers WHERE email = 'teacher@test.com'
);

-- ============================================================
-- Vérification
-- ============================================================
SELECT 'admins' AS table_name, COUNT(*) AS total FROM admins
UNION ALL
SELECT 'teachers', COUNT(*) FROM teachers;

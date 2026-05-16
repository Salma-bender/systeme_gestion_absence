USE systeme_absence;

-- Mettre à jour les mots de passe avec un hash BCrypt valide pour "123456"
-- Hash généré avec BCrypt cost=10
UPDATE admins 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin@test.com';

UPDATE teachers 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'teacher@test.com';

-- Vérification
SELECT email, LEFT(password, 30) as password_preview FROM admins;
SELECT email, LEFT(password, 30) as password_preview FROM teachers;

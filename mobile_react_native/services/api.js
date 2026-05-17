// ============================================================
// IMPORTANT : remplace cette IP par l'IP locale de ta machine
// Trouve-la avec : ipconfig (Windows) ou ifconfig (Mac/Linux)
// Exemple : 192.168.1.45
// Sur émulateur Android uniquement : utiliser 10.0.2.2
// ============================================================
const BASE_URL = 'http://100.89.162.147:8080';

/**
 * Détecte les étudiants dans une image SANS enregistrer en base.
 * Appelé chaque seconde pendant le scan continu.
 * @param {string} imageUri
 * @returns {Promise<Array<{id, firstName, lastName}>>}
 */
export async function detectStudents(imageUri) {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'classroom.jpg',
  });

  const response = await fetch(`${BASE_URL}/attendance/detect`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  return response.json(); // [{ id, firstName, lastName }, ...]
}

/**
 * Enregistre les présences finales en base.
 * Appelé une seule fois quand le professeur clique "Arrêter".
 * @param {number[]} studentIds
 * @returns {Promise<Array>}
 */
export async function saveAttendances(studentIds) {
  const response = await fetch(`${BASE_URL}/attendance/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentIds }),
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  return response.json();
}

const BASE_URL = 'http://100.89.161.245:8080';

// Token stocké en mémoire (fonctionne avec Expo Go)
let _token = null;

// ─── Auth ────────────────────────────────────────────────────

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || `Erreur ${response.status}`);
  }

  const data = await response.json();

  if (data.role !== 'TEACHER') {
    throw new Error('Accès réservé aux professeurs.');
  }

  _token = data.token;
  return data;
}

export function logout() {
  _token = null;
}

export function getToken() {
  return _token;
}

// ─── Session ─────────────────────────────────────────────────

/**
 * Valide un code de séance auprès du backend.
 * @returns {Promise<{id, subject, code, teacherName, status}>}
 */
export async function validateSessionCode(code) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/api/session/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Code de séance invalide');
  }

  return response.json();
}

// ─── Attendance ───────────────────────────────────────────────

/**
 * Détecte les étudiants dans une image SANS enregistrer en base.
 */
export async function detectStudents(imageUri) {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'classroom.jpg',
  });

  const response = await fetch(`${BASE_URL}/attendance/detect`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  return response.json();
}

/**
 * Enregistre les présences finales en base.
 */
export async function saveAttendances(studentIds, sessionId) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/attendance/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ studentIds, sessionId }),
  });

  if (!response.ok) {
    throw new Error(`Erreur serveur: ${response.status}`);
  }

  return response.json();
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  photoPath: string;
}

export interface Attendance {
  id: number;
  student: Student;
  detectedAt: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeSessions: number;
  totalAttendances: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ==========================================
  // ÉTUDIANTS
  // ==========================================

  /** Ajouter un étudiant avec son image */
  createStudent(firstName: string, lastName: string, image: File): Observable<Student> {
    const form = new FormData();
    form.append('firstName', firstName);
    form.append('lastName', lastName);
    form.append('image', image);
    return this.http.post<Student>(`${this.baseUrl}/students`, form);
  }

  /** Récupérer tous les étudiants */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  // ==========================================
  // PRÉSENCES
  // ==========================================

  /** Récupérer toutes les présences */
  getAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance`);
  }

  // ==========================================
  // ENSEIGNANTS (ADMIN uniquement)
  // ==========================================

  /** Récupérer tous les enseignants */
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.baseUrl}/api/admin/teachers`);
  }

  /** Créer un nouvel enseignant */
  createTeacher(name: string, email: string, password: string): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.baseUrl}/api/admin/teachers`, { name, email, password });
  }

  /** Supprimer un enseignant */
  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/admin/teachers/${id}`);
  }

  // ==========================================
  // STATISTIQUES TABLEAU DE BORD
  // ==========================================

  /** Récupérer les statistiques globales */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/api/admin/stats`);
  }
}

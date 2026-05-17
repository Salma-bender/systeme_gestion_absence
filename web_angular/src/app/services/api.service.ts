import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance.model';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  photoPath: string;
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
  totalSessions: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  // ==========================================
  // ÉTUDIANTS
  // ==========================================

  createStudent(firstName: string, lastName: string, image: File): Observable<Student> {
    const form = new FormData();
    form.append('firstName', firstName);
    form.append('lastName', lastName);
    form.append('image', image);
    return this.http.post<Student>(`${this.baseUrl}/students`, form);
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  // ==========================================
  // PRÉSENCES
  // ==========================================

  getAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance`);
  }

  getAttendancesBySession(sessionId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance/session/${sessionId}`);
  }

  getAttendancesByStudent(studentId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance/student/${studentId}`);
  }

  saveAttendancesForSession(sessionId: number, studentIds: number[]): Observable<Attendance[]> {
    return this.http.post<Attendance[]>(`${this.baseUrl}/attendance/session/${sessionId}`, { studentIds });
  }

  // ==========================================
  // ENSEIGNANTS (ADMIN)
  // ==========================================

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.baseUrl}/api/admin/teachers`);
  }

  createTeacher(name: string, email: string, password: string): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.baseUrl}/api/admin/teachers`, { name, email, password });
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/admin/teachers/${id}`);
  }

  // ==========================================
  // STATISTIQUES TABLEAU DE BORD
  // ==========================================

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/api/admin/stats`);
  }
}

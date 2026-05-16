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

@Injectable({ providedIn: 'root' })
export class ApiService {
  // URL du backend Spring Boot
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

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

  /** Récupérer toutes les présences */
  getAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance`);
  }
}

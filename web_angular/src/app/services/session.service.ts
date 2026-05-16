import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session, SessionRequest } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private baseUrl = 'http://localhost:8080/api/session';

  constructor(private http: HttpClient) {}

  createSession(data: SessionRequest): Observable<Session> {
    return this.http.post<Session>(this.baseUrl, data);
  }

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.baseUrl);
  }

  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.baseUrl}/${id}`);
  }

  getSessionsByTeacher(teacherId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/teacher/${teacherId}`);
  }

  validateCode(code: string): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}/validate`, { code });
  }

  closeSession(id: number): Observable<Session> {
    return this.http.put<Session>(`${this.baseUrl}/${id}/close`, {});
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

export interface MyAttendance {
  id: number;
  detectedAt: string;
  student: { id: number; firstName: string; lastName: string };
}

@Component({
  selector: 'app-my-attendances',
  templateUrl: './my-attendances.component.html',
  standalone: false,
})
export class MyAttendancesComponent implements OnInit {
  attendances: MyAttendance[] = [];
  loading = true;
  error = '';
  studentName = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadAttendances();
  }

  loadProfile(): void {
    this.http.get<any>('http://localhost:8080/api/student/me').subscribe({
      next: (s) => {
        this.studentName = `${s.firstName} ${s.lastName}`;
        this.cdr.detectChanges();
      }
    });
  }

  loadAttendances(): void {
    this.http.get<MyAttendance[]>('http://localhost:8080/api/student/my-attendances').subscribe({
      next: (data) => {
        this.attendances = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Impossible de charger vos présences.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

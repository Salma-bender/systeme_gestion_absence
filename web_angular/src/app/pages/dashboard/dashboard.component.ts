import { Component, OnInit } from '@angular/core';
import { ApiService, DashboardStats } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = { totalStudents: 0, activeSessions: 0, totalAttendances: 0 };
  isLoading = true;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      // Admin: fetch stats from dedicated endpoint
      this.apiService.getStats().subscribe({
        next: (data) => {
          this.stats = data;
          this.isLoading = false;
        },
        error: () => {
          // Fallback: compute from individual endpoints
          this.loadStatsFallback();
        }
      });
    } else {
      // Teacher: compute from individual endpoints
      this.loadStatsFallback();
    }
  }

  private loadStatsFallback(): void {
    let studentsLoaded = false;
    let attendancesLoaded = false;

    this.apiService.getStudents().subscribe({
      next: (students) => {
        this.stats.totalStudents = students.length;
        studentsLoaded = true;
        if (attendancesLoaded) this.isLoading = false;
      },
      error: () => {
        studentsLoaded = true;
        if (attendancesLoaded) this.isLoading = false;
      }
    });

    this.apiService.getAttendances().subscribe({
      next: (attendances) => {
        this.stats.totalAttendances = attendances.length;
        attendancesLoaded = true;
        if (studentsLoaded) this.isLoading = false;
      },
      error: () => {
        attendancesLoaded = true;
        if (studentsLoaded) this.isLoading = false;
      }
    });
  }
}

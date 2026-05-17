import { Component, OnInit } from '@angular/core';
import { ApiService, DashboardStats } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Attendance } from '../../models/attendance.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = { totalStudents: 0, activeSessions: 0, totalAttendances: 0, totalSessions: 0 };
  recentAttendances: Attendance[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentAttendances();
  }

  private loadStats(): void {
    this.apiService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        // Backend inaccessible : afficher les stats à 0 sans rester bloqué
        this.isLoading = false;
      }
    });
  }

  private loadRecentAttendances(): void {
    this.apiService.getAttendances().subscribe({
      next: (data) => {
        this.recentAttendances = data
          .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
          .slice(0, 5);
      },
      error: () => {}
    });
  }
}

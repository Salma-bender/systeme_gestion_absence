import { Component, OnInit } from '@angular/core';
import { ApiService, DashboardStats } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

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
    private sessionService: SessionService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.apiService.getStats().subscribe({
        next: (data) => { this.stats = data; this.isLoading = false; },
        error: () => { this.errorMessage = 'Erreur lors du chargement des statistiques.'; this.isLoading = false; }
      });
    } else {
      this.loadTeacherStats();
    }
  }

  private loadTeacherStats(): void {
    let done = 0;
    const check = () => { if (++done === 3) this.isLoading = false; };

    this.apiService.getStudents().subscribe({
      next: (s) => { this.stats.totalStudents = s.length; check(); },
      error: () => check()
    });

    this.apiService.getAttendances().subscribe({
      next: (a) => { this.stats.totalAttendances = a.length; check(); },
      error: () => check()
    });

    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        this.stats.activeSessions = sessions.filter(s => s.status === 'ACTIVE').length;
        check();
      },
      error: () => check()
    });
  }
}

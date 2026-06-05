import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.apiService.getStats().subscribe({
        next: (data) => {
          this.stats = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des statistiques.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      forkJoin({
        students: this.apiService.getStudents().pipe(catchError(() => of([]))),
        attendances: this.apiService.getAttendances().pipe(catchError(() => of([]))),
        sessions: this.sessionService.getAllSessions().pipe(catchError(() => of([])))
      }).subscribe({
        next: ({ students, attendances, sessions }) => {
          this.stats.totalStudents = students.length;
          this.stats.totalAttendances = attendances.length;
          this.stats.activeSessions = (sessions as any[]).filter((s: any) => s.status === 'ACTIVE').length;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}

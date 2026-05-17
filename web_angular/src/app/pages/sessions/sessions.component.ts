import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../models/session.model';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  standalone: false,
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [];
  loading = true;
  error = '';

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.sessionService.getAllSessions().subscribe({
      next: (data) => {
        this.sessions = Array.isArray(data) ? data : (data as any).value || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Sessions] Erreur:', err.status);
        this.error = `Erreur ${err.status} : impossible de charger les séances`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/sessions', id]);
  }

  closeSession(id: number): void {
    if (!confirm('Fermer cette séance ?')) return;
    this.sessionService.closeSession(id).subscribe({
      next: () => this.loadSessions(),
      error: () => alert('Erreur lors de la fermeture')
    });
  }

  goCreate(): void {
    this.router.navigate(['/sessions/create']);
  }
}

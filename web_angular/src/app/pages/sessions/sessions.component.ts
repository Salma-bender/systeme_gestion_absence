import { Component, OnInit } from '@angular/core';
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
  loading = false;
  error = '';

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.sessionService.getAllSessions().subscribe({
      next: (data) => { this.sessions = data; this.loading = false; },
      error: () => { this.error = 'Erreur lors du chargement'; this.loading = false; }
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

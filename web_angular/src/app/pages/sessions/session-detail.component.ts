import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../models/session.model';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  standalone: false,
})
export class SessionDetailComponent implements OnInit {
  session: Session | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.sessionService.getSessionById(id).subscribe({
      next: (data) => { this.session = data; this.loading = false; },
      error: () => { this.error = 'Séance introuvable'; this.loading = false; }
    });
  }

  close(): void {
    if (!this.session || !confirm('Fermer cette séance ?')) return;
    this.sessionService.closeSession(this.session.id).subscribe({
      next: (updated) => { this.session = updated; },
      error: () => alert('Erreur lors de la fermeture')
    });
  }

  back(): void {
    this.router.navigate(['/sessions']);
  }
}

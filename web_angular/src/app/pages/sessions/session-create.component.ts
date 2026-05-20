import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { SessionRequest } from '../../models/session.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-session-create',
  templateUrl: './session-create.component.html',
  standalone: false,
})
export class SessionCreateComponent implements OnInit {
  form: SessionRequest = { subject: '', teacherId: 0, durationMinutes: 90 };
  loading = false;
  error = '';

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (id) this.form.teacherId = id;
  }

  submit(): void {
    if (!this.form.subject.trim()) { this.error = 'La matière est obligatoire'; return; }
    if (!this.form.teacherId) { this.error = 'Impossible de récupérer votre identifiant.'; return; }
    this.loading = true;
    this.error = '';
    this.sessionService.createSession(this.form).subscribe({
      next: () => this.router.navigate(['/sessions']),
      error: () => { this.error = 'Erreur lors de la création'; this.loading = false; }
    });
  }

  cancel(): void {
    this.router.navigate(['/sessions']);
  }
}

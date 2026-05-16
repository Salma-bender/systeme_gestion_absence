import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { SessionRequest } from '../../models/session.model';

@Component({
  selector: 'app-session-create',
  templateUrl: './session-create.component.html',
  standalone: false,
})
export class SessionCreateComponent {
  form: SessionRequest = { subject: '', teacherId: 1, durationMinutes: 90 };
  loading = false;
  error = '';

  constructor(private sessionService: SessionService, private router: Router) {}

  submit(): void {
    if (!this.form.subject.trim()) { this.error = 'La matière est obligatoire'; return; }
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Teacher } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  teachers: Teacher[] = [];
  teacherForm: FormGroup;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Redirect non-admin users
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }

    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.apiService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des enseignants.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { name, email, password } = this.teacherForm.value;
    this.apiService.createTeacher(name, email, password).subscribe({
      next: () => {
        this.successMessage = 'Enseignant créé avec succès.';
        this.teacherForm.reset();
        this.isSubmitting = false;
        this.loadTeachers();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création de l\'enseignant.';
        this.isSubmitting = false;
      }
    });
  }

  deleteTeacher(id: number): void {
    if (!confirm('Supprimer cet enseignant ?')) return;

    this.apiService.deleteTeacher(id).subscribe({
      next: () => {
        this.teachers = this.teachers.filter(t => t.id !== id);
        this.successMessage = 'Enseignant supprimé.';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression.';
      }
    });
  }

  get name() { return this.teacherForm.get('name'); }
  get email() { return this.teacherForm.get('email'); }
  get password() { return this.teacherForm.get('password'); }
}

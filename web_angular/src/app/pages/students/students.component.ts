import { Component, OnInit } from '@angular/core';
import { ApiService, Student } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  standalone: false,
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  firstName = '';
  lastName = '';
  selectedFile: File | null = null;
  message = '';
  loading = false;
  listLoading = true;

  constructor(private api: ApiService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.listLoading = true;
    this.api.getStudents().subscribe({
      next: (data) => { this.students = data; this.listLoading = false; },
      error: (err) => {
        this.message = 'Erreur chargement étudiants : ' + (err.message || err.status);
        this.listLoading = false;
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  submit(): void {
    if (!this.firstName || !this.lastName || !this.selectedFile) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading = true;
    this.message = '';
    this.api.createStudent(this.firstName, this.lastName, this.selectedFile).subscribe({
      next: () => {
        this.message = 'Étudiant ajouté avec succès.';
        this.firstName = '';
        this.lastName = '';
        this.selectedFile = null;
        this.loading = false;
        this.loadStudents();
      },
      error: (err) => {
        this.message = 'Erreur: ' + (err.error || err.message);
        this.loading = false;
      },
    });
  }
}

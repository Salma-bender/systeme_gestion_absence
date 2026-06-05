import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService, Attendance, Student } from '../../services/api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  standalone: false,
})
export class AttendanceComponent implements OnInit {
  attendances: Attendance[] = [];
  students: Student[] = [];
  message = '';
  successMessage = '';
  selectedStudentId: number | null = null;
  loading = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAttendances();
    this.loadStudents();
  }

  loadAttendances(): void {
    this.api.getAttendances().subscribe({
      next: (data) => { this.attendances = data; this.cdr.detectChanges(); },
      error: (err) => { this.message = 'Erreur: ' + (err.message || err.status); this.cdr.detectChanges(); }
    });
  }

  loadStudents(): void {
    this.api.getStudents().subscribe({
      next: (data) => { this.students = data; this.cdr.detectChanges(); }
    });
  }

  addManual(): void {
    if (!this.selectedStudentId) return;
    this.loading = true;
    this.api.addAttendance(this.selectedStudentId).subscribe({
      next: () => {
        this.successMessage = 'Présence ajoutée.';
        this.selectedStudentId = null;
        this.loading = false;
        this.loadAttendances();
      },
      error: () => { this.message = 'Erreur lors de l\'ajout.'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cette présence ?')) return;
    this.api.deleteAttendance(id).subscribe({
      next: () => {
        this.attendances = this.attendances.filter(a => a.id !== id);
        this.successMessage = 'Présence supprimée.';
        this.cdr.detectChanges();
      },
      error: () => { this.message = 'Erreur lors de la suppression.'; this.cdr.detectChanges(); }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Attendance } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  standalone: false,
})
export class AttendanceComponent implements OnInit {
  attendances: Attendance[] = [];
  filtered: Attendance[] = [];
  message = '';
  loading = false;

  filterSession = '';
  filterStudent = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.loading = true;
    this.message = '';
    this.api.getAttendances().subscribe({
      next: (data) => {
        this.attendances = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.message = 'Erreur chargement présences : ' + (err.message || err.status);
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.filtered = this.attendances.filter(a => {
      const matchSession = !this.filterSession ||
        a.sessionSubject?.toLowerCase().includes(this.filterSession.toLowerCase()) ||
        a.sessionCode?.toLowerCase().includes(this.filterSession.toLowerCase());
      const matchStudent = !this.filterStudent ||
        a.studentFirstName?.toLowerCase().includes(this.filterStudent.toLowerCase()) ||
        a.studentLastName?.toLowerCase().includes(this.filterStudent.toLowerCase());
      return matchSession && matchStudent;
    });
  }

  clearFilters(): void {
    this.filterSession = '';
    this.filterStudent = '';
    this.applyFilters();
  }
}

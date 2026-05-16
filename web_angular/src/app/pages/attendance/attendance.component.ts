import { Component, OnInit } from '@angular/core';
import { ApiService, Attendance } from '../../services/api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  standalone: false,
})
export class AttendanceComponent implements OnInit {
  attendances: Attendance[] = [];
  message = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.api.getAttendances().subscribe({
      next: (data) => (this.attendances = data),
      error: (err) => {
        console.error('getAttendances error', err);
        this.message = 'Erreur chargement présences : ' + (err.message || err.status);
      },
    });
  }
}

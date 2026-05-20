import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './pages/students/students.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { SessionCreateComponent } from './pages/sessions/session-create.component';
import { SessionDetailComponent } from './pages/sessions/session-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { authGuard } from './guards/auth.guard';
import { teacherGuard } from './guards/teacher.guard';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard',  component: DashboardComponent,  canActivate: [authGuard] },
  // Étudiants : ADMIN et TEACHER
  { path: 'students',   component: StudentsComponent,   canActivate: [authGuard] },
  // Séances et présences : TEACHER uniquement
  { path: 'attendance', component: AttendanceComponent, canActivate: [teacherGuard] },
  { path: 'sessions',        component: SessionsComponent,      canActivate: [teacherGuard] },
  { path: 'sessions/create', component: SessionCreateComponent, canActivate: [teacherGuard] },
  { path: 'sessions/:id',    component: SessionDetailComponent, canActivate: [teacherGuard] },
  // Paramètres : ADMIN uniquement
  { path: 'settings',   component: SettingsComponent,   canActivate: [adminGuard] },
  { path: '',  redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

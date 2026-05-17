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

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard',  component: DashboardComponent,  canActivate: [authGuard] },
  { path: 'students',   component: StudentsComponent,   canActivate: [authGuard] },
  { path: 'attendance', component: AttendanceComponent, canActivate: [authGuard] },
  { path: 'sessions',        component: SessionsComponent,      canActivate: [authGuard] },
  { path: 'sessions/create', component: SessionCreateComponent, canActivate: [authGuard] },
  { path: 'sessions/:id',    component: SessionDetailComponent, canActivate: [authGuard] },
  { path: 'settings',   component: SettingsComponent,   canActivate: [authGuard] },
  { path: '',  redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

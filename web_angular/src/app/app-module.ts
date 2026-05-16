import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Pages
import { StudentsComponent } from './pages/students/students.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { SessionCreateComponent } from './pages/sessions/session-create.component';
import { SessionDetailComponent } from './pages/sessions/session-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';

// Shared components
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CardComponent } from './components/card/card.component';
import { TableComponent } from './components/table/table.component';

// Interceptors
import { authInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    App,
    // Pages
    StudentsComponent,
    AttendanceComponent,
    LoginComponent,
    RegisterComponent,
    SessionsComponent,
    SessionCreateComponent,
    SessionDetailComponent,
    DashboardComponent,
    SettingsComponent,
    // Shared components
    NavbarComponent,
    SidebarComponent,
    CardComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App]
})
export class AppModule {}

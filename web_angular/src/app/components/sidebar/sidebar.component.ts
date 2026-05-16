import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed = false;

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

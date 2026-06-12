import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthenticationService } from '../../../services/authentication/authentication-service';

@Component({
  selector: 'app-portal-layout-component',
  imports: [RouterOutlet, NgIcon, RouterLink, RouterLinkActive],
  templateUrl: './portal-layout-component.html',
  styleUrl: './portal-layout-component.css',
})
export class PortalLayoutComponent {
  isMenuOpen = false;

  private authenticationService = inject(AuthenticationService);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authenticationService.logout();
  }
}

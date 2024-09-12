import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT, CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button class="au-btn-submit" (click)="auth.logout({ logoutParams: { returnTo: document.location.origin } })">
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button class="au-btn-submit" (click)="auth.loginWithRedirect()">Log in</button>
    </ng-template>
  `,
  standalone: true,
  imports: [CommonModule] // Import CommonModule ici
})
export class AuthButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}

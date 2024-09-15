import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth0ManagementService } from 'src/app/services/auth0-management.service';

@Component({
  selector: 'app-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button
        class="au-btn-submit"
        (click)="
          auth.logout({ logoutParams: { returnTo: document.location.origin } })
        "
      >
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button class="au-btn-submit" (click)="auth.loginWithRedirect()">
        Log in
      </button>
    </ng-template>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class AuthButtonComponent {

  @Output() isAdminEvent = new EventEmitter<boolean>();
  userInfo: any = null;
  userRoles: any = null;
  userId: string = '';
  mgmtApiToken: string = '';
  domain: string = 'dev-itepivn30bc81pjc.us.auth0.com';

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private http: HttpClient,
    private authManagementService: Auth0ManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.userInfo = user;
      if (this.userInfo) {
        this.userId = this.userInfo.sub;
        this.getRoles();
      }
    });
  }

  getRoles() {
    this.authManagementService.getManagementApiToken().subscribe(
      (response: any) => {
        this.mgmtApiToken = response.access_token;

        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.mgmtApiToken}`
        });

        const url = `https://${this.domain}/api/v2/users/${this.userId}/roles`;

        this.http.get(url, { headers }).subscribe(
          (roles: any) => {
            this.userRoles = roles;

            const payload = {
              firstname: this.userInfo.nickname,
              lastname: this.userInfo.nickname,
              email: this.userInfo.email,
              role: roles[0].name
            };

            this.authManagementService.sendUserToBackend(payload).subscribe(
              (response: any) => {
                this.redirectBasedOnRole();
              },
              (error: any) => {
                console.log('Erreur lors de l\'envoi du payload au backend:', error);
              }
            );
          },
          (error: any) => {
            console.log('Erreur lors de la récupération des rôles:', error);
          }
        );
      },
      (error: any) => {
        console.log('Erreur lors de la récupération du token:', error);
      }
    );
  }


  redirectBasedOnRole() {
    const isAdmin = this.userRoles.some((role: any) => role.name === 'admin');

    this.isAdminEvent.emit(isAdmin);

    if (isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/products']);
    }
  }


}

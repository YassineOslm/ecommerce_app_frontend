import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth0ManagementService } from 'src/app/services/auth0-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info-button',
  templateUrl: './user-info-button.component.html',
  styleUrls: ['./user-info-button.component.css']
})
export class UserInfoButtonComponent implements OnInit {
  @Output() isAdminEvent = new EventEmitter<boolean>(); // Pour notifier le parent
  userInfo: any = null;
  userRoles: any = null;
  userId: string = '';
  mgmtApiToken: string = '';
  domain: string = 'dev-itepivn30bc81pjc.us.auth0.com';

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private authManagementService: Auth0ManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
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
            this.redirectBasedOnRole();
          },
          (error: any) => {
            console.error('Erreur lors de la récupération des rôles:', error);
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

    // Envoyer l'information au parent
    this.isAdminEvent.emit(isAdmin);

    if (isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/products']);
    }
  }
}

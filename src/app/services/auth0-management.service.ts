import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth0ManagementService {
  private domain = 'dev-itepivn30bc81pjc.us.auth0.com';
  private clientId = 'v4SsAJovsb0rEluLpj8IjSDUyay7eUDd';  // Remplacer par votre client_id
  private clientSecret = 'Ow3Afz56cUeLDM_k2N0_JKixptBDYAChNRZYTsSPAaXbbJHLwJyEl_5g9Gp3my_8';  // Remplacer par votre client_secret
  private audience = `https://${this.domain}/api/v2/`;
  private tokenUrl = `https://${this.domain}/oauth/token`;

  private backendUrl = 'http://localhost:8080/api/users/create';

  // Stockage des infos utilisateur et des rôles via BehaviorSubject
  private userInfoSource = new BehaviorSubject<any>(null);
  private userRolesSource = new BehaviorSubject<any>(null);

  userInfo$ = this.userInfoSource.asObservable();
  userRoles$ = this.userRolesSource.asObservable();

  constructor(private http: HttpClient) {}

  // Obtenir le token d'accès Management API
  getManagementApiToken(): Observable<any> {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: 'client_credentials'
    };
    return this.http.post(this.tokenUrl, body);  // Faire la requête pour obtenir le token
  }

  sendUserToBackend(payload: any): Observable<any> {
    return this.http.post(this.backendUrl, payload);
  }

  setUserInfo(userInfo: any) {
    this.userInfoSource.next(userInfo);
  }

  setUserRoles(userRoles: any) {
    this.userRolesSource.next(userRoles);
  }

  getUserRoles(userId: string, mgmtApiToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${mgmtApiToken}`
    });

    const url = `https://${this.domain}/api/v2/users/${userId}/roles`;
    return this.http.get(url, { headers });
  }
}

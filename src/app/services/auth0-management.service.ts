import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth0ManagementService {
  private domain = 'dev-itepivn30bc81pjc.us.auth0.com';  // Domaine correct pour Auth0
  private clientId = 'v4SsAJovsb0rEluLpj8IjSDUyay7eUDd';  // Votre client_id
  private clientSecret = 'Ow3Afz56cUeLDM_k2N0_JKixptBDYAChNRZYTsSPAaXbbJHLwJyEl_5g9Gp3my_8';  // Votre client_secret
  private audience = `https://${this.domain}/api/v2/`;  // API Management
  private tokenUrl = `https://${this.domain}/oauth/token`;  // URL pour obtenir le token

  constructor(private http: HttpClient) {}

  private backendUrl = 'http://localhost:8080/api/users/create';

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
}

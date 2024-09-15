import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAddress } from '../common/user-address';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = 'http://localhost:8080/api/users/email/';
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private httpClient: HttpClient) {}

  getUserByEmail(email: string): Observable<any> {
    return this.httpClient.get(`${this.backendUrl}${email}`);
  }

  getUserAddresses(userId: number): Observable<UserAddress[]> {
    const url = `${this.baseUrl}/${userId}/addresses`;
    return this.httpClient.get<UserAddress[]>(url);
  }

  addUserAddress(userId: number, address: UserAddress): Observable<UserAddress> {
    const url = `${this.baseUrl}/${userId}/addAddress`;
    return this.httpClient.post<UserAddress>(url, address);
  }
}

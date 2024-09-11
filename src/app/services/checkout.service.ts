import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { UserAddress } from '../common/user-address';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<HttpResponse<Blob>> {
    return this.httpClient.post(this.purchaseUrl, purchase, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  getUserAddresses(userId: number): Observable<UserAddress[]> {
    const url = `${this.baseUrl}/${userId}/addresses`;
    return this.httpClient.get<UserAddress[]>(url);
  }
}

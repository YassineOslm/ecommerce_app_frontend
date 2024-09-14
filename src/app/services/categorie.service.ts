import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private baseUrl = 'http://localhost:8080/api/categories';

  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.baseUrl).pipe(
      map(response => response.content)
    );
  }

  getCategory(categoryId: number): Observable<ProductCategory> {
    return this.httpClient.get<ProductCategory>(`${this.baseUrl}/${categoryId}`);
  }

  updateCategory(category: ProductCategory): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${category.id}`, category);
  }

  createCategory(category: ProductCategory): Observable<ProductCategory> {
    return this.httpClient.post<ProductCategory>(this.baseUrl, category);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${categoryId}`);
  }
}

interface GetResponseProductCategory {
  content: ProductCategory[];
}

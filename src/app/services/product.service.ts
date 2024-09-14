import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginateByCategory(thePage: number,
    thePageSize: number,
    filterBy: string,
    ascending: boolean,
    theCategoryId: number) : Observable<GetResponseProducts> {

    //need to build URL based on the category id, page and size
    const searchUrl = `${this.baseUrl}/searchByCatId?id=${theCategoryId}`
    + `&sortBy=${filterBy}&ascending=${ascending}`
    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductListPaginated(thePageNumber: number, thePageSize: number): Observable<GetResponseProducts> {
    const url = `${this.baseUrl}/listPaginated?page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  searchProductsPaginate(thePage: number,
    thePageSize: number,
    filterBy: string,
    ascending: boolean,
    theKeyWord: string) : Observable<GetResponseProducts> {

    //need to build URL based on the keyword, page and size
    const searchUrl = `${this.baseUrl}/searchByName?name=${theKeyWord}`
                      + `&sortBy=${filterBy}&ascending=${ascending}`
                      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getAllProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/all`; // Endpoint pour tous les produits
    return this.httpClient.get<Product[]>(url);
  }

  getProduct(theProductId: number): Observable<Product> {
    //need to build the URL based on the product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  updateProduct(productId: number, updatedProduct: Product): Observable<Product> {
    const updateUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.put<Product>(updateUrl, updatedProduct);
  }

  addProduct(productDto: ProductDto): Observable<{ newProductId: number }> {
    return this.httpClient.post<{ newProductId: number }>(`${this.baseUrl}`, productDto);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${productId}`);
  }


}

export interface ProductDto {
  name: string;
  productDescription: string;
  unitPrice: number;
  unitsInStock: number;
  categoryId: number;
  categoryName: string;
  images: ImageDto[];
}

export interface ImageDto {
  imageUrl: string;
  rankShow: number;
}


interface GetResponseProducts {
  content: Product[],
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
}


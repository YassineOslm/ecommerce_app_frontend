import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/categories';

  constructor(private httpClient: HttpClient) { }

  // OK
  getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number) : Observable<GetResponseProducts> {

    //need to build URL based on the category id, page and size
    const searchUrl = `${this.baseUrl}/searchByCatId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  /* getProductList(theCategoryId: number) : Observable<Product[]> {

    //need to build URL based on the category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  } */

  //OK
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response.content)
    );
  }


  /* searchProducts(theKeyWord: string): Observable<Product[]> {
    //need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.getProducts(searchUrl);
  } */

  //OK
  searchProductsPaginate(thePage: number,
    thePageSize: number,
    theKeyWord: string) : Observable<GetResponseProducts> {

    //need to build URL based on the keyword, page and size
    const searchUrl = `${this.baseUrl}/searchByName?name=${theKeyWord}`
                      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  /* private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  } */

  //OK
  getProduct(theProductId: number): Observable<Product> {
    //need to build the URL based on the product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts {
  content: Product[],
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
}

interface GetResponseProductCategory {
  content: ProductCategory[];
}


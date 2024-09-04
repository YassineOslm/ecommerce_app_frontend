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

  /* getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number) : Observable<GetResponseProducts> {

    //need to build URL based on the category id, page and size
    const searchUrl = `${this.baseUrl}/searchByCatId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  } */

  getProductListPaginate(thePage: number,
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


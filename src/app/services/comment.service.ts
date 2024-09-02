import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Comment } from '../common/comment';


@Injectable({
  providedIn: 'root',
})
export class CommentService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getCommentList(
    thePage: number,
    thePageSize: number,
    sortBy: string,
    ascending: boolean,
    productId: number
  ): Observable<GetResponseComments> {
    const searchUrl =
      `${this.baseUrl}/${productId}/comments?sortBy=${sortBy}&ascending=${ascending}` +
      `&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl);
    return this.httpClient.get<GetResponseComments>(searchUrl);
  }

  addComment(productId: number, userComment: string, userRating: number, userId: number): Observable<any> {
    const addCommentUrl = `${this.baseUrl}/${productId}/addComment`;
    const commentData = {
      comment: userComment,
      grade: userRating,
      product: {
        id: productId,
      },
      user: {
        id: userId,
      },
    };
    return this.httpClient.post<{ content: string }>(addCommentUrl, commentData);
  }

  getCommentCount(productId: number): Observable<number> {
    const url = `${this.baseUrl}/${productId}/commentCount`;
    return this.httpClient.get<{ id: number, commentCounts: number }>(url).pipe(
      map(response => response.commentCounts)
    );
  }

  getAverageRating(productId: number): Observable<number> {
    const url = `${this.baseUrl}/${productId}/averageGrade`;
    return this.httpClient.get<{ id: number, averageGrade: number }>(url).pipe(
      map(response => response.averageGrade)
    );
  }

}

interface GetResponseComments {
  content: Comment[];
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

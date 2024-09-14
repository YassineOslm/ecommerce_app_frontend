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

  getAverageRatingForProducts(): Observable<{ [productId: number]: number }> {
    const url = `${this.baseUrl}/average-ratings`;
    return this.httpClient.get<{ [productId: number]: number }>(url);
  }

  deleteComment(commentId: number): Observable<void> {
    const url = `${this.baseUrl}/comments/${commentId}`;
    return this.httpClient.delete<void>(url);
  }


  getComment(commentId: number): Observable<Comment> {
    const url = `${this.baseUrl}/comments/${commentId}`;
    return this.httpClient.get<Comment>(url);
  }


  updateComment(updatedComment: Comment): Observable<any> {
    const url = `${this.baseUrl}/comments/${updatedComment.id}`;
    console.log('updatedComment');
    console.log(updatedComment);
    return this.httpClient.put(url, updatedComment);
  }


}

interface GetResponseComments {
  content: Comment[];
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

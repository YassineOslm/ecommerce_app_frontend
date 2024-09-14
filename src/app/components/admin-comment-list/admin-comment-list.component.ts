import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { Comment } from 'src/app/common/comment';

@Component({
  selector: 'app-admin-comment-list',
  templateUrl: './admin-comment-list.component.html',
  styleUrls: ['./admin-comment-list.component.css']
})
export class AdminCommentListComponent implements OnInit {

  products: Product[] = [];
  selectedProductId: number = 0;
  comments: Comment[] = [];

  commentPageNumber: number = 1;
  commentPageSize: number = 5;
  totalCommentsElements: number = 0;
  totalCommentPages: number = 0;

  constructor(
    private productService: ProductService,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.productService.getAllProducts().subscribe(
      data => {
        this.products = data;
      },
      error => {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    );
  }

  loadComments(): void {
    if (this.selectedProductId > 0) {
      this.commentService.getCommentList(this.commentPageNumber - 1, this.commentPageSize, 'dateCreated', true, this.selectedProductId)
        .subscribe(
          this.processCommentResult(),
          error => {
            console.error('Erreur lors de la récupération des commentaires:', error);
          }
        );
    }
  }

  processCommentResult() {
    return (data: any) => {
      this.comments = data.content;
      this.commentPageNumber = data.number + 1;
      this.commentPageSize = data.size;
      this.totalCommentsElements = data.totalElements;
      this.totalCommentPages = data.totalPages;
    };
  }

  deleteComment(commentId: number) {
    if (confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      this.commentService.deleteComment(commentId).subscribe(
        () => {
          console.log('Commentaire supprimé avec succès');
          this.loadComments();
        },
        error => {
          console.error('Erreur lors de la suppression du commentaire:', error);
        }
      );
    }
  }

  onCommentPageChange(event: any): void {
    this.commentPageNumber = event;
    this.loadComments();
  }
}

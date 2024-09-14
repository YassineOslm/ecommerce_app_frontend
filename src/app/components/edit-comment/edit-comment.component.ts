import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { Comment } from 'src/app/common/comment';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css'],
})
export class EditCommentComponent implements OnInit {
  commentForm: FormGroup = this.formBuilder.group({});
  commentId: number = 0;
  commentUpdated: boolean = false;
  existingComment: Comment = new Comment('', '', '', '', '', '', new Date(), 0);

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commentId = this.getCommentId();

    this.commentForm = this.formBuilder.group({
      rating: ['0'],
      commentText: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(300),
          FormValidators.notOnlyWhiteSpace,
        ],
      ],
    });

    this.loadCommentDetails();
  }

  goBack() {
    this.router.navigate(['/admin/comments']);
  }

  getCommentId(): number {
    return +this.route.snapshot.paramMap.get('id')!;
  }

  loadCommentDetails(): void {
    this.commentService.getComment(this.commentId).subscribe(
      (comment: Comment) => {
        this.existingComment = comment;
        this.commentForm.patchValue({
          rating: comment.grade,
          commentText: comment.comment,
        });
      },
      (error) => {
        console.error('Error loading comment details:', error);
      }
    );
  }

  onRatingChanged(event: any): void {
    this.commentForm.get('rating')?.setValue(event.target.value, { emitEvent: false });
  }

  onSubmit(): void {
    if (!this.isFormInvalid()) {

      let updatedComment: Comment = this.existingComment;
      updatedComment.comment = this.commentForm.value.commentText;
      updatedComment.grade = this.commentForm.value.rating;

      this.commentService.updateComment(updatedComment)
        .subscribe({
          next: (response) => {
            this.commentUpdated = true;
          },
          error: (error) => {
            console.log('Error updating comment:', error);
          },
        });
    }
  }

  isFormInvalid(): boolean {
    return this.commentForm.invalid;
  }

  get commentText() {
    return this.commentForm.get('commentText');
  }
}

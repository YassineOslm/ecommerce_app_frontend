import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-add-new-comment',
  templateUrl: './add-new-comment.component.html',
  styleUrls: ['./add-new-comment.component.css'],
})
export class AddNewCommentComponent {
  commentForm: FormGroup = this.formBuilder.group({});
  productId: number = 0;
  newCommentAdded: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.getProductId();

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
  }

  getProductId(): number {
    return +this.route.snapshot.paramMap.get('id')!;
  }

  get commentText() {
    return this.commentForm.get('commentText');
  }

  onRatingChanged(event: any): void {
    this.commentForm
      .get('rating')
      ?.setValue(event.target.value, { emitEvent: false });
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onSubmit(): void {
    if (!this.isFormInvalid()) {
      const formValues = this.commentForm.value;
      const randomUserId = this.getRandomNumber(1, 25);

      this.commentService.addComment(this.productId, formValues.commentText, formValues.rating, randomUserId)
        .subscribe({
          next: (response) => {
            if (response.content === 'added') {
              this.newCommentAdded = true;
            }
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });
    }
  }

  isFormInvalid(): boolean {
    return this.commentForm.invalid;
  }
}

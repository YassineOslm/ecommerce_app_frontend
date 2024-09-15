import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/services/user-service.service';


@Component({
  selector: 'app-add-new-comment',
  templateUrl: './add-new-comment.component.html',
  styleUrls: ['./add-new-comment.component.css'],
})
export class AddNewCommentComponent implements OnInit {
  commentForm: FormGroup = this.formBuilder.group({});
  productId: number = 0;
  newCommentId: number = 0;
  newCommentAdded: boolean = false;
  userEmail: string = '';
  userId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService
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

    this.auth.user$.subscribe((user) => {
      if (user && user.email) {
        this.userEmail = user.email;
        this.fetchUserDetails(this.userEmail);
      } else {
        console.error('User email is undefined');
      }
    });

  }

    fetchUserDetails(email: string): void {
      this.userService.getUserByEmail(email).subscribe(
        (user: any) => {
          console.log('User details:', user);
          this.userId = user.id;
        },
        (error: any) => {
          console.error('Error fetching user details:', error);
        }
      );
  }

  getProductId(): number {
    return +this.route.snapshot.paramMap.get('id')!;
  }

  get commentText() {
    return this.commentForm.get('commentText');
  }

  onRatingChanged(event: any): void {
    this.commentForm.get('rating')?.setValue(event.target.value, { emitEvent: false });
  }

  onSubmit(): void {
    if (!this.isFormInvalid()) {
      const formValues = this.commentForm.value;
      this.commentService.addComment(this.productId, formValues.commentText, formValues.rating, this.userId)
        .subscribe({
          next: (response) => {
            this.newCommentAdded = true;
            this.newCommentId = response.content.id;
          },
          error: (error: any) => {
            console.error('Error:', error);
          },
        });
    }
  }

  isFormInvalid(): boolean {
    return this.commentForm.invalid;
  }
}

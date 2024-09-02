import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/common/comment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  filterForm: FormGroup = this.formBuilder.group({});

  comments: Comment[] = [];

  productId: number = 0;

  // Properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 4;
  theTotalElements: number = 0;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.productId = this.getProductId();

    // Initialize the filter form with default values
    this.filterForm = this.formBuilder.group({
      filterBy: ['date'],
      sortOrder: ['asc']
    });

    // Load initial comments
    this.loadComments();

    // Update comments whenever the filter form values change
    this.filterForm.valueChanges.subscribe(values => {
      this.thePageNumber = 1
      this.loadComments();
    });
  }

  loadComments() {
    const filterValues = this.filterForm.value;

    this.commentService.getCommentList(
      this.thePageNumber - 1,
      this.thePageSize,
      (filterValues.filterBy === 'date') ? 'dateCreated' : 'grade',
      (filterValues.sortOrder === 'asc') ? true : false,
      this.productId
    ).subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.comments = data.content;
      this.thePageNumber = data.number + 1;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
    };
  }

  getProductId(): number {
    return +this.route.snapshot.paramMap.get('id')!;
  }

  getDelay(index: number): string {
    return `${index * 0.3}s`;
  }

  getRatingDetails(rating: number): [number, number, number] {
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [fullStars, hasHalfStar ? 1 : 0, emptyStars];
  }

  getImage(comment: Comment) :string {
    return `https://randomuser.me/api/portraits/${(comment.gender === "M") ? 'men' : 'women'}/${comment.idUser}.jpg`;
  }

  getFullName(comment: Comment) {
    return comment.userFirstName + " " +comment.userLastName;
  }

  getPostedDate(comment: Comment) :string {
    const date = new Date(comment.dateCreated);
    const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: false
    };
    return "Posté le " + new Intl.DateTimeFormat('fr-FR', options).format(date) + 'h';
  }

}

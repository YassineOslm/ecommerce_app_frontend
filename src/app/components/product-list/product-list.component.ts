import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productRatings: { [productId: number]: [number, number, number] } = {};
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  filterForm: FormGroup = this.formBuilder.group({});

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      filterBy: ['noFilter'],
      sortOrder: ['asc'],
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.thePageNumber = 1;
      this.listProducts();
    });

    this.route.paramMap.subscribe(() => {
      this.listProducts();
      this.getProductRatings();
    });
  }


  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProduct();
    }
  }
  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyWord) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyWord;

    const filterValues = this.filterForm.value;

/*     console.log("filterBy:", filterValues.filterBy);
    console.log("sortOrder:", filterValues.sortOrder); */

    this.productService
      .searchProductsPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        filterValues.filterBy,
        filterValues.sortOrder === 'asc' ? true : false,
        theKeyWord
      )
      .subscribe(this.processResult());
  }

  handleListProduct() {
    //check if "id" parameter in available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    // if we have a different category id than previous
    // then set thePageNumber back to 1

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    const filterValues = this.filterForm.value;

/*     console.log("filterBy:", filterValues.filterBy);
    console.log("sortOrder:", filterValues.sortOrder); */

    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        filterValues.filterBy,
        filterValues.sortOrder === 'asc' ? true : false,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  updatePage(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data.content;
      this.thePageNumber = data.number + 1;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
    };
  }

  getRatingDetails(rating: number): [number, number, number] {
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [fullStars, hasHalfStar ? 1 : 0, emptyStars];
  }

  getProductRatings(): void {
    this.commentService.getAverageRatingForProducts().subscribe({
      next: (ratings: { [productId: number]: number }) => {
        Object.keys(ratings).forEach((productId) => {
          this.productRatings[+productId] = this.getRatingDetails(ratings[+productId]);
        });
      },
      error: (err) => {
        console.error('Error fetching product ratings:', err);
      },
    });
  }


  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}

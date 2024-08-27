import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { Image } from 'src/app/common/image';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {

  product!: Product;
  currentImageIndex = 0;
  rating :number = 2.1;
  ratingDetails :number[] = this.getRatingDetails(this.rating);

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });

  }

  ngAfterViewInit(): void {
    this.updateImageDisplay();
    window.addEventListener('resize', this.updateImageDisplay.bind(this));
  }

  handleProductDetails() {
    const theProductId = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
        this.currentImageIndex = 0;
        this.updateImageDisplay();
      }
    );
  }

  addToCart() {
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

  onImageSelect(image: Image) {
    const imgShowcase = document.querySelector('.img-showcase') as HTMLElement;
    const images = document.querySelectorAll('.img-showcase img');
    const displayWidth = images[0].clientWidth;
    const index = this.product.images.findIndex(img => img.imageUrl === image.imageUrl);
    imgShowcase.style.transform = `translateX(${-index * displayWidth}px)`;
    this.currentImageIndex = index;
  }

  updateImageDisplay() {
    const imgShowcase = document.querySelector('.img-showcase') as HTMLElement;
    const images = document.querySelectorAll('.img-showcase img');
    if (images.length > 0) {
      const displayWidth = images[0].clientWidth;
      imgShowcase.style.transform = `translateX(${-this.currentImageIndex * displayWidth}px)`;
    }
  }

  getRatingDetails(rating: number): [number, number, number] {
    // Arrondir la note à un chiffre décimal
    const roundedRating = Math.round(rating * 2) / 2;

    // Calculer le nombre d'étoiles pleines
    const fullStars = Math.floor(roundedRating);

    // Vérifier s'il y a une demi-étoile
    const hasHalfStar = roundedRating % 1 !== 0;

    // Calculer le nombre d'étoiles vides
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [fullStars, hasHalfStar ? 1 : 0, emptyStars];
  }
}

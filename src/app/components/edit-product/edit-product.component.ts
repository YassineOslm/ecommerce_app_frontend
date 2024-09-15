import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Validators added
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productForm: FormGroup = this.formBuilder.group({});
  productId: number = 0;
  product!: Product;
  isUpdated: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      productDescription: ['', [Validators.required, Validators.minLength(10)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      unitsInStock: ['', [Validators.required, Validators.min(0)]],
      dateCreated: [{ value: '', disabled: true }],
      lastUpdated: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const productIdParam = this.route.snapshot.paramMap.get('id');
    if (productIdParam) {
      this.productId = +productIdParam;

      this.productService.getProduct(this.productId).subscribe(
        (data: Product) => {
          this.product = data;
          this.productForm.patchValue({
            name: this.product.name,
            productDescription: this.product.productDescription,
            unitPrice: this.product.unitPrice,
            unitsInStock: this.product.unitsInStock,
            dateCreated: this.product.dateCreated,
            lastUpdated: this.product.lastUpdated
          });
        },
        error => {
          console.error('Error fetching product:', error);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const updatedProduct: Product = {
      ...this.product,
      ...this.productForm.value
    };

    this.productService.updateProduct(this.productId, updatedProduct).subscribe(
      () => {
        this.isUpdated = true;
      },
      error => {
        console.error('Error updating product:', error);
      }
    );
  }

}

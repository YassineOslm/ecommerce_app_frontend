import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategorieService } from 'src/app/services/categorie.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductCategory } from 'src/app/common/product-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent implements OnInit {

  productForm: FormGroup;
  categories: ProductCategory[] = [];
  submitted = false;
  isCreated = false;
  newProductId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategorieService,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      productDescription: ['', [Validators.required, Validators.minLength(10)]],
      unitPrice: ['', [Validators.required, Validators.min(0.01)]],
      unitsInStock: ['', [Validators.required, Validators.min(10)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getProductCategories().subscribe(
      data => {
        this.categories = data;
      }
    );
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const newProductDto: ProductDto = {
      name: this.productForm.get('name')?.value,
      productDescription: this.productForm.get('productDescription')?.value,
      unitPrice: this.productForm.get('unitPrice')?.value,
      unitsInStock: this.productForm.get('unitsInStock')?.value,
      categoryId: this.productForm.get('category')?.value,
      categoryName: this.getCategoryName(this.productForm.get('category')?.value),
      images: [
        {
          imageUrl: 'assets/images/products/placeholder.png',
          rankShow: 1
        },
        {
          imageUrl: 'assets/images/products/placeholder.png',
          rankShow: 2
        },
        {
          imageUrl: 'assets/images/products/placeholder.png',
          rankShow: 3
        },
        {
          imageUrl: 'assets/images/products/placeholder.png',
          rankShow: 4
        }
      ]
    };

    this.productService.addProduct(newProductDto).subscribe(
      (response: any) => {
        this.newProductId = response.newProductId;
        this.isCreated = true;
      },
      error => {
        console.log('Error adding product:', error);
      }
    );
  }


  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === +categoryId);
    return category ? category.categoryName : '';
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
export interface ProductDto {
  name: string;
  productDescription: string;
  unitPrice: number;
  unitsInStock: number;
  categoryId: number;
  categoryName: string;
  images: ImageDto[];
}

export interface ImageDto {
  imageUrl: string;
  rankShow: number;
}

import { Component, OnInit } from '@angular/core';
import { CategorieService } from 'src/app/services/categorie.service';
import { ProductCategory } from 'src/app/common/product-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-category-list',
  templateUrl: './admin-category-list.component.html',
  styleUrls: ['./admin-category-list.component.css']
})
export class AdminCategoryListComponent implements OnInit {

  categories: ProductCategory[] = [];

  constructor(
    private categoryService: CategorieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getProductCategories().subscribe(
      (data: ProductCategory[]) => {
        this.categories = data;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        () => {
          console.log('Category deleted successfully');
          this.loadCategories();
        },
        error => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }
}

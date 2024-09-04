import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];


  constructor(private categorieService: CategorieService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.categorieService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    )
  }

}

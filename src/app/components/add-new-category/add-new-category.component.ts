import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.css']
})
export class AddNewCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  newCategoryId: number = 0;
  isCreated: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategorieService,
    private router: Router
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    // Pas besoin de charger une catégorie existante, car il s'agit d'une nouvelle catégorie
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const newCategory = new ProductCategory(0, this.categoryForm.get('name')?.value);
      this.categoryService.createCategory(newCategory).subscribe(
        (response: any) => {
          console.log(response);
          this.newCategoryId = response.newCategoryId;
          this.isCreated = true
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }
}

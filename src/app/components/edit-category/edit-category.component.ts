import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  categoryId: number = 0;
  isUpdated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoryService: CategorieService ,
    private router: Router
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCategory();
  }

  loadCategory(): void {
    this.categoryService.getCategory(this.categoryId).subscribe(
      category => {
        this.categoryForm.patchValue({
          name: category.categoryName
        });
      },
      error => {
        console.error('Erreur lors du chargement de la catégorie', error);
      }
    );
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.categoryService.updateCategory(new ProductCategory(this.categoryId,this.categoryForm.value.name)).subscribe(
        (response) => {
          console.log('Catégorie mise à jour avec succès', response);
          this.isUpdated = true;
        },
        (error: any) => {
          console.log('Erreur lors de la mise à jour de la catégorie:', error);
        }
      );

    }
  }

  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }

}

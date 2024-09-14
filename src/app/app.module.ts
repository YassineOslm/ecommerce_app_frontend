import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { AddNewCommentComponent } from './components/add-new-comment/add-new-comment.component';
import { SuccessComponent } from './components/success/success.component';
import { AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { UserInfoButtonComponent } from './components/user-info-button/user-info-button.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminProductListComponent } from './components/admin-product-list/admin-product-list.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AdminCommentListComponent } from './components/admin-comment-list/admin-comment-list.component';
import { EditCommentComponent } from './components/edit-comment/edit-comment.component'; // Import du nouveau composant AdminPanelComponent

const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'cart-details', component: CartDetailsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'admin/products', component: AdminProductListComponent },
  { path: 'admin/comments', component: AdminCommentListComponent },
  { path: 'admin/edit-comment/:id', component: EditCommentComponent},
  { path: 'admin/add-new-product', component: AddNewProductComponent},
  { path: 'admin/edit-product/:id', component: EditProductComponent},
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'success/:id', component: SuccessComponent },
  { path: 'products/:id/comments', component: CommentListComponent },
  { path: 'products/:id/add-new-comment', component: AddNewCommentComponent, canActivate: [AuthGuard] },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    CommentListComponent,
    AddNewCommentComponent,
    SuccessComponent,
    UserInfoButtonComponent,
    AdminPanelComponent,
    AdminProductListComponent,
    AddNewProductComponent,
    EditProductComponent,
    AdminCommentListComponent,
    EditCommentComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'dev-itepivn30bc81pjc.us.auth0.com',
      clientId: 'foFNGGJ2PUM4SHVglsog76eGPm0CwT4N',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    AuthButtonComponent // Import du bouton d'authentification
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce_app_frontend';
  isAdmin: boolean = false;

  handleIsAdminEvent(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }
}

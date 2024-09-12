import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce_app_frontend';
  isAdmin: boolean = false;  // Par défaut, l'utilisateur n'est pas admin

  // Cette méthode sera appelée lorsque l'événement `isAdminEvent` sera émis par UserInfoButtonComponent
  handleIsAdminEvent(isAdmin: boolean) {
    this.isAdmin = isAdmin;  // Mettre à jour l'état de l'utilisateur en fonction de son rôle
  }
}

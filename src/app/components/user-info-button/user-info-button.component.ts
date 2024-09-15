import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-info-button',
  templateUrl: './user-info-button.component.html',
  styleUrls: ['./user-info-button.component.css']
})
export class UserInfoButtonComponent{

  menuActive: boolean = false; // Variable to track menu visibility

  constructor(
  ) {}

  menuToggle() {
    this.menuActive = !this.menuActive;
  }
}

import { Component, OnInit } from '@angular/core';
import { UserAddress } from 'src/app/common/user-address';
import { Auth0ManagementService } from 'src/app/services/auth0-management.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userInfo: any = null;
  userRoles: any = null;
  userAddresses: UserAddress[] = [];

  constructor(private authManagementService: Auth0ManagementService,
              private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authManagementService.userInfo$.subscribe(
      (user) => {
        this.userInfo = user;
      }
    );

    this.authManagementService.userRoles$.subscribe(
      (roles) => {
        this.userRoles = roles;
      }
    );

    this.userService.getUserByEmail(this.userInfo.email).subscribe(
      (response: any) => {
        this.userService.getUserAddresses(response.id).subscribe(
          (response: any) => {
            this.userAddresses = response;
          },
          (error: any) => {
            console.log('Error fetching user addresses', error)
          }
        );
      },
      (error: any) => {
        console.log('Error fetching user info', error)
      }
    );


  }
}

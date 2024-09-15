import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAddress } from 'src/app/common/user-address';
import { Auth0ManagementService } from 'src/app/services/auth0-management.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.css']
})
export class EditUserInfoComponent implements OnInit {
  userId: number = 0;
  userInfo: any = null;
  userAddresses: UserAddress[] = [];
  addressForm: FormGroup = this.formBuilder.group({});;
  addressTypes = ['SHIPPING', 'BILLING', 'BOTH'];
  canAddShipping = true;
  canAddBilling = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authManagementService: Auth0ManagementService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      box: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      addressType: ['', Validators.required]
    });
    this.authManagementService.userInfo$.subscribe(user => {
      this.userInfo = user;
      this.loadUserAddresses();
    });
  }

  loadUserAddresses(): void {
    // Récupérer les adresses de l'utilisateur
    this.userService.getUserByEmail(this.userInfo.email).subscribe(response => {
      this.userId = response.id
      this.userService.getUserAddresses(response.id).subscribe(addresses => {
        this.userAddresses = addresses;
        this.updateAddressTypeAvailability();
      });
    });
  }

  updateAddressTypeAvailability(): void {
    this.canAddShipping = !this.userAddresses.some(address => address.addressType === 'SHIPPING' || address.addressType === 'BOTH');
    this.canAddBilling = !this.userAddresses.some(address => address.addressType === 'BILLING' || address.addressType === 'BOTH');
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const newAddress: UserAddress = this.addressForm.value;

      if (newAddress.addressType === 'SHIPPING' && !this.canAddShipping) {
        alert("You cannot add more than one SHIPPING address.");
        return;
      }

      if (newAddress.addressType === 'BILLING' && !this.canAddBilling) {
        alert("You cannot add more than one BILLING address.");
        return;
      }

      console.log('New address submitted:', newAddress);
      console.log('userId ', this.userId);
      this.userService.addUserAddress(this.userId, newAddress).subscribe(
        (response) => {
          console.log('Address added successfully:', response);
        },
        (error) => {
          console.error('Error adding address:', error);
        }
      );
    }
  }

  editAddress(address: UserAddress): void {
    this.addressForm.patchValue(address);
  }

  deleteAddress(addressId: number): void {
    // Implémentation de la logique pour supprimer l'adresse
    console.log('Delete address:', addressId);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}

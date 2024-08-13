import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup = this.formBuilder.group({});
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ])
        ,
        lastName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ]),
        email: new FormControl('',
          [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
          ]
        )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ])
        ,
        city: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ])
        ,
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ])
        ,
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ])
        ,
        city: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ])
        ,
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ])
        ,
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace
          ]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth();
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get("customer")?.value);

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet () { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity () { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState () { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry () { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode () { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet () { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity () { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState () { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry () { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode () { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType () { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard () { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber () { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode () { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  copyShippingAddressToBillingAddress(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.checked) {
        this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        this.billingAddressStates = this.shippingAddressStates;

    } else {
        this.checkoutFormGroup.controls['billingAddress'].reset();
        this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number = (selectedYear == currentYear) ? new Date().getMonth() + 1 : 1;

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode}`);
    console.log(`${formGroupName} country name : ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName == 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);

      }
    );
  }

}

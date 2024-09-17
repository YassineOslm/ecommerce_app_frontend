import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { User } from 'src/app/common/user';
import { UserAddress } from 'src/app/common/user-address';
import { Auth0ManagementService } from 'src/app/services/auth0-management.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { UserService } from 'src/app/services/user-service.service';
import { FormValidators } from 'src/app/validators/form-validators'; // Votre fichier de validateurs personnalisés
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  userInfo: any = null;
  userForCheckout: User = new User('','','','','','');
  checkoutFormGroup: FormGroup = this.formBuilder.group({});
  savedShippingAddresses: UserAddress[] = [];
  savedBillingAddresses: UserAddress[] = [];
  useNewShippingAddress = false;
  useNewBillingAddress = false;
  selectedShippingAddress: UserAddress = new UserAddress(1, '', '', '', '', '', '', '');
  selectedBillingAddress: UserAddress = new UserAddress(1, '', '', '', '', '', '', '');
  totalQuantity: number = 0;
  totalPrice: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  @ViewChild('useNewShippingAddressCheckbox')
  useNewShippingAddressCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('useNewBillingAddressCheckbox')
  useNewBillingAddressCheckbox!: ElementRef<HTMLInputElement>;


  stripe = Stripe(environment.stripePblishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private shopFormService: ShopFormService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authManagementService: Auth0ManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.setupStripePaymentForm();

    this.authManagementService.userInfo$.subscribe(
      (user) => {
        this.userInfo = user;
      }
    );
    this.reviewCartDetail();
    this.loadUserAddresses(this.getUserInfo().idUser);

    this.checkoutFormGroup = this.formBuilder.group({
      shippingAddress: this.formBuilder.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace,
          ],
        ],
        number: ['', [Validators.required, Validators.pattern('^[0-9]{1,3}$')]],
        box: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        postalCode: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{1,5}$')],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace,
          ],
        ],
        country: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace,
          ],
        ],
      }),
      billingAddress: this.formBuilder.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace,
          ],
        ],
        number: ['', [Validators.required, Validators.pattern('^[0-9]{1,3}$')]],
        box: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
        postalCode: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{1,5}$')],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace,
          ],
        ],
        country: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace,
          ],
        ],
      }),
      creditCard: this.formBuilder.group({

        /* cardType: ['', Validators.required],
        nameOnCard: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            FormValidators.notOnlyWhiteSpace,
          ],
        ],
        cardNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{16}$')],
        ],
        securityCode: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{3}$')],
        ],
        expirationMonth: ['', Validators.required],
        expirationYear: ['', Validators.required], */
      }),
      deliveryMethod: ['Standard', Validators.required],
    });

    // Populate credit card months and years
    /* const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });

    this.shopFormService.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    }); */

    this.updateTotalPrice();
  }

  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', {hidePostalCode: true});
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event:any) => {
      this.displayError = document.getElementById('card-errors');

      if(event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }

    });
  }

  getUserInfo() {
    return { idUser: 3 };
  }

  loadUserAddresses(userId: number) {

    this.userService.getUserByEmail(this.userInfo.email).subscribe(
      (response: any) => {
        this.userForCheckout = response;
        this.userService.getUserAddresses(response.id).subscribe(
          (data: UserAddress[]) => {
            data.forEach((address) => {
              if (address.addressType === 'SHIPPING') {
                this.savedShippingAddresses.push(address);
              } else if (address.addressType === 'BILLING') {
                this.savedBillingAddresses.push(address);
              } else if (address.addressType === 'BOTH') {
                this.savedShippingAddresses.push(address);
                this.savedBillingAddresses.push(address);
              }
            });
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

  updateTotalPrice() {
    let deliveryCost = 0;

    const selectedDeliveryMethod =
      this.checkoutFormGroup.get('deliveryMethod')?.value;
    switch (selectedDeliveryMethod) {
      case 'Standard':
        deliveryCost = 5.0;
        break;
      case 'Express':
        deliveryCost = 15.0;
        break;
      case 'Overnight':
        deliveryCost = 25.0;
        break;
    }

    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice + deliveryCost)
    );
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    const user: User = new User(
      this.userForCheckout.id,
      this.userForCheckout.firstname,
      this.userForCheckout.lastname,
      this.userForCheckout.email,
      this.userForCheckout.gender || 'M',
      this.userForCheckout.phoneNumber || '+32489012345'
    );

    const orderBuilded = this.buildOrder();

    const order: Order = new Order(
      orderBuilded.totalPrice,
      orderBuilded.totalQuantity,
      orderBuilded.shippingAddress,
      orderBuilded.billingAddress,
      orderBuilded.paymentMethod,
      orderBuilded.paymentStatus,
      orderBuilded.deliveryMethod,
      orderBuilded.deliveryStatus
    );

    const orderItems: OrderItem[] = this.buildOrderItems(this.cartService.cartItems);

    const purchase: Purchase = new Purchase(user, order, orderItems);

    console.log('purchase', purchase);

    this.paymentInfo.amount = this.totalPrice * 100;
    this.paymentInfo.currency = "EUR";

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement
              },
            },
            {
              handleActions: false
            }
          ).then((result: any) => {
            if (result.error) {
              alert(`There were an error: ${result.error.message}`)
            } else {
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response) => {
                  console.log('Response:', response);

                  const pdfBlob = response.body;

                  if (pdfBlob) {
                    const contentDisposition = response.headers.get(
                      'Content-Disposition'
                    );
                    let fileName = 'receipt.pdf';

                    if (contentDisposition) {
                      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);

                      if (fileNameMatch && fileNameMatch.length > 1) {
                        fileName = fileNameMatch[1];
                      }
                    }

                    const downloadURL = URL.createObjectURL(
                      new Blob([pdfBlob], { type: 'application/pdf' })
                    );
                    const link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = fileName;
                    link.click();
                    URL.revokeObjectURL(downloadURL);
                    this.resetCart(fileName);
                  } else {
                    console.error('PDF Blob is null');
                  }
                },
                error: (err) => {
                  console.log('There was an error:', err.message);
                }
              });
            }
          })
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
}




  resetCart(orderId: string) {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // Navigate to the success page with the orderId
    this.router.navigateByUrl(`/success/${orderId}`);
  }


  buildOrderItems(cartItems: CartItem[]): OrderItem[] {
    let orderItems: OrderItem[] = [];
    cartItems.forEach((cartItem) => {
      orderItems.push(
        new OrderItem(
          cartItem.id,
          cartItem.name,
          cartItem.unitPrice.toFixed(2).toString(),
          cartItem.quantity,
          (cartItem.unitPrice * cartItem.quantity).toFixed(2).toString()
        )
      );
    });
    return orderItems;
  }

  buildOrder() {
    const selectedDeliveryMethod =
      this.checkoutFormGroup.get('deliveryMethod')?.value;
    let deliveryMethod: string;

    switch (selectedDeliveryMethod) {
      case 'Express':
        deliveryMethod = 'Express - 15.00';
        break;
      case 'Overnight':
        deliveryMethod = 'Overnight - 25.00';
        break;
      default:
        deliveryMethod = 'Standard - 5.00';
    }

    return {
      totalPrice: this.totalPrice.toFixed(2).toString(),
      totalQuantity: this.totalQuantity.toString(),
      paymentMethod: this.creditCardType?.value || 'Visa',
      paymentStatus: 'Accepted',
      deliveryMethod: deliveryMethod,
      deliveryStatus: 'Delivered',
      shippingAddress: this.getShippingAddress(),
      billingAddress: this.getBillingAddress()
    };
  }

  selectShippingAddress(address: UserAddress) {
    this.selectedShippingAddress = address;
    this.useNewShippingAddress = false;
    this.checkoutFormGroup.get('shippingAddress')?.reset();
    this.checkoutFormGroup.get('shippingAddress')?.disable();
    if (this.useNewShippingAddressCheckbox) {
      this.useNewShippingAddressCheckbox.nativeElement.checked = false;
    }
  }

  selectBillingAddress(address: UserAddress) {
    this.selectedBillingAddress = address;
    this.useNewBillingAddress = false;
    this.checkoutFormGroup.get('billingAddress')?.reset();
    this.checkoutFormGroup.get('billingAddress')?.disable();
    if (this.useNewBillingAddressCheckbox) {
      this.useNewBillingAddressCheckbox.nativeElement.checked = false;
    }
  }

  toggleNewShippingAddress(event: any) {
    this.useNewShippingAddress = event.target.checked;
    if (this.useNewShippingAddress) {
      this.selectedShippingAddress = new UserAddress(1, '', '', '', '', '', '', '');
      this.checkoutFormGroup.get('shippingAddress')?.enable();
    } else {
      this.checkoutFormGroup.get('shippingAddress')?.disable();
    }
  }

  toggleNewBillingAddress(event: any) {
    this.useNewBillingAddress = event.target.checked;
    if (this.useNewBillingAddress) {
      this.selectedBillingAddress = new UserAddress(1, '', '', '', '', '', '', '');
      this.checkoutFormGroup.get('billingAddress')?.enable();
    } else {
      this.checkoutFormGroup.get('billingAddress')?.disable();
    }
  }


  copyShippingAddressToBillingAddress(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  reviewCartDetail() {
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number =
      selectedYear == currentYear ? new Date().getMonth() + 1 : 1;

    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  getShippingAddress(): any {
    if (this.useNewShippingAddress) {
      return `${this.shippingAddressNumber?.value.number} ${this.shippingAddressStreet?.value}, box ${this.shippingAddressBox?.value}, ${this.shippingAddressPostalCode?.value}, ${this.shippingAddressCity?.value}, ${this.shippingAddressCountry?.value}`;
    } else {
      return`${this.selectedShippingAddress.number} ${this.selectedShippingAddress.street}, box ${this.selectedShippingAddress.box}, ${this.selectedShippingAddress.postalCode}, ${this.selectedShippingAddress.city}, ${this.selectedShippingAddress.country}`;
    }
  }

  getBillingAddress(): any {
    if (this.useNewBillingAddress) {
      return `${this.billingAddressNumber?.value} ${this.billingAddressStreet?.value}, box ${this.billingAddressBox?.value}, ${this.billingAddressPostalCode?.value}, ${this.billingAddressCity?.value}, ${this.billingAddressCountry?.value}`;
    } else {
      return `${this.selectedBillingAddress.number} ${this.selectedBillingAddress.street}, box ${this.selectedBillingAddress.box}, ${this.selectedBillingAddress.postalCode}, ${this.selectedBillingAddress.city}, ${this.selectedBillingAddress.country}`;
    }
  }

  getTotalPriceFromService(): number {
    let totalPrice = 0;
    this.cartService.totalPrice.subscribe((price) => {
      totalPrice = price;
    });
    return totalPrice;
  }

  // Accessors for the credit card form controls
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressNumber() {
    return this.checkoutFormGroup.get('shippingAddress.number');
  }
  get shippingAddressBox() {
    return this.checkoutFormGroup.get('shippingAddress.box');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressPostalCode() {
    return this.checkoutFormGroup.get('shippingAddress.postalCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressNumber() {
    return this.checkoutFormGroup.get('billingAddress.number');
  }
  get billingAddressBox() {
    return this.checkoutFormGroup.get('billingAddress.box');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressPostalCode() {
    return this.checkoutFormGroup.get('billingAddress.postalCode');
  }
  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get nameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get cardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get securityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get expirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get expirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }
}

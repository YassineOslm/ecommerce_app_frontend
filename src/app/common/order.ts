import { Address } from "./address";

export class Order {

  constructor(
    public totalPrice: number,
    billingAddress : Address,
    shippingAddress : Address,
    paymentMethod: string,
    paymentStatus: string,
    deliveryMethod: string,
    deliveryStatus: string) {}

}

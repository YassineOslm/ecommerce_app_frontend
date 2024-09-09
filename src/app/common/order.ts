export class Order {

  constructor(
    public totalPrice: string,
    public totalQuantity: string,
    public billingAddress: string,
    public shippingAddress: string,
    public paymentMethod: string,
    public paymentStatus: string,
    public deliveryMethod: string,
    public deliveryStatus: string
  ) {}
}

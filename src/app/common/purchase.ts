import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

  customer: Customer = new Customer("","","");
  shippingAddress = new Address();
  billingAddress = new Address();
  order: Order = new Order(0,0);
  orderItems: OrderItem[] = [];

}

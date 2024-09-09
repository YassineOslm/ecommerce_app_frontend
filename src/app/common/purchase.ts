import { User } from "./user";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

  user: User;
  order: Order;
  orderItems: OrderItem[];

  constructor(user: User, order: Order, orderItems: OrderItem[]) {
    this.user = user;
    this.order = order;
    this.orderItems = orderItems;
  }
}

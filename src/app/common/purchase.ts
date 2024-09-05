import { Address } from "./address";
import { User } from "./user";
import { Order } from "./order";
import { CartItem } from "./cart-item";

export class Purchase {

  user: User = new User("", "", "", "", "", "");
  order: Order = new Order(0, new Address(), new Address(), "", "", "", "");
  orderItems: CartItem[] = [];
}

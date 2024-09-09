export class OrderItem {


  constructor(public idProduct: string,
              public name: string,
              public unitPrice: string,
              public quantity: number,
              public subTotalPrice: string)
    { }

}

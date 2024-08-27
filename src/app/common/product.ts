import { Image } from "./image";

export class Product {

  constructor(public id: string,
              public name: string,
              public productDescription: string,
              public unitPrice: number,
              public images: Image[],
              public unitsInStock: number,
              public dateCreated: Date,
              public lastUpdated: Date
      ) {
  }

}

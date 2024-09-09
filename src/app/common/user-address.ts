export class UserAddress {

  constructor(
    public idUserAddress: number,
    public street: string,
    public number: string,
    public box: string,
    public postalCode: string,
    public city: string,
    public country: string,
    public addressType: string
  ) { }

}

export class Comment {
  constructor(
    public id: string,
    public idUser: string,
    public userFirstName: string,
    public userLastName: string,
    public gender: string,
    public comment: string,
    public dateCreated: Date,
    public grade: number
  ) {}

}

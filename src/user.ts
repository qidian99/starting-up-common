export interface UserInterface {
  id: String;
  email: String;
}

export class User {
  id: String;
  email: String;

  constructor(user: UserInterface) {
    const { id, email } = user;
    this.id = id;
    this.email = email;
  }
}

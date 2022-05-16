export type MockUser = {
  first: string;
  last: string;
  email: string;
  birthday: string | Date;
}

export interface CreatedUser extends MockUser {
  uid: string;
}

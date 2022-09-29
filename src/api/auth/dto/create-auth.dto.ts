export class CreateAuthDto {
  uid: string;
  password: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  emailVerified: boolean;
  photoURL: string;
  disabled: boolean;
}

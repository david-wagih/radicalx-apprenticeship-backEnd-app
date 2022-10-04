import {
  IsEmail,
  IsNotEmpty,
  IsMobilePhone,
  IsBoolean
} from 'class-validator';

export class CreateAuthDto {
  uid: string;
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
  @IsMobilePhone()
  phoneNumber: string;
  displayName: string;
  @IsBoolean()
  emailVerified: boolean;
  photoURL: string;
  @IsBoolean()
  disabled: boolean;
}

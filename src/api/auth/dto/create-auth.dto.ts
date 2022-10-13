import { IsEmail, IsNotEmpty, IsMobilePhone, IsBoolean } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  username: string;
}

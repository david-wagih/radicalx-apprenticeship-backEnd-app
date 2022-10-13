import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller({ host: 'localhost'})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Registration

  // testing the validationPipe
  // @Post('TestRegister')
  // TestRegisterVerification(@Body() authDto: CreateAuthDto){
  //   return 'passed'
  // }

  @Post('signup')
  registerUser(@Body() authDto: CreateAuthDto) {
    return this.authService.signup(
      authDto.email,
      authDto.password,
      authDto.username,
      authDto.phoneNumber,
    );
  }

  // User Logging in
  @Post('loginUser') //todo: Get data from DTO
  LoginUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.LoginUser(authDto.email, authDto.password);
  }

  // User Update Account Data

  @Patch('updateAccount') //todo: Get data from DTO
  updateUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.updateUser(
      authDto.email,
      authDto.phoneNumber,
      authDto.username,
      authDto.photoURL,
      authDto.disabled,
    );
  }

  //User Remove User
  @Delete('removeUser') //todo: get data from DTO
  removeUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.removeUser();
  }

  @Post('resetPass')
  resetPass(@Body() email: string) {
    return this.authService.sendResetMail(email);
    //this.authService.sendMail(email);
  }

  @Post('passwordResetEmail') //Done by Omar
  passwordResetEmail(@Body() body: JSON) {
    const email = body["email"];

    return this.authService.passwordResetEmail(email);
  }

  @Post('resetPassword')
  resetPassword(@Body() oobCode: string, newPassword: string) {
    return this.authService.resetPassword(oobCode, newPassword);
  }

  @Post('signout')
  signout() {
    return this.authService.signout();
  }
}

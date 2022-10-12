import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller({ host: 'localhost', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Registration

  // testing the validationPipe
  // @Post('TestRegister')
  // TestRegisterVerification(@Body() authDto: CreateAuthDto){
  //   return 'passed'
  // }

  @Get('registerUser')
  getRegistrationPage() {
    return this.authService.getRegistrationPage();
  }

  @Post('registerUser')
  registerUser(@Body() authDto: CreateAuthDto) {
    return this.authService.registerUser(
      authDto.email,
      authDto.password,
      authDto.phoneNumber ?? '+10000000000',
      authDto.displayName ?? authDto.email,
      authDto.photoURL ?? 'https:example.com/photoURL',
      false,
      false,
    );
  }

  // User Logging in
  @Get('loginUser')
  getLoginPage() {
    return this.authService.getLoginPage();
  }

  @Post('loginUser') //todo: Get data from DTO
  LoginUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.LoginUser(authDto.email, authDto.password);
  }

  // User Update Account Data

  @Get('updateAccount') //todo: Get data from DTO
  getUpdatePage(@Body() authDto: UpdateAuthDto) {
    return this.authService.getUpdatePage();
  }

  @Patch('updateAccount') //todo: Get data from DTO
  updateUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.updateUser(
      authDto.email,
      authDto.phoneNumber,
      authDto.displayName,
      authDto.photoURL,
      authDto.disabled,
    );
  }

  //User Remove User
  @Get('removeUser') //todo: Get data from DTO
  getRemovePage(@Body() authDto: UpdateAuthDto) {
    return this.authService.getRemovePage();
  }

  @Delete('removeUser') //todo: get data from DTO
  removeUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.removeUser();
  }

  @Post('resetPass')
  resetPass(@Body() email: string) {
    return this.authService.sendResetMail(email);
    //this.authService.sendMail(email);
  }

  @Post('passwordResetEmail')
  passwordResetEmail(@Body() email: string) {
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

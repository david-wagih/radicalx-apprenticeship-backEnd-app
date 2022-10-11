import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller({ host: 'api.localhost', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Registration

  // testing the validationPipe
  // @Post('TestRegister')
  // TestRegisterVerification(@Body() authDto: CreateAuthDto){
  //   return 'passed'
  // }

  @Get('register')
  getRegistrationPage() {
    return this.authService.getRegistrationPage();
  }

  @Post('register')
  registerUser(@Body() authDto: CreateAuthDto) {
    return this.authService.registerUser(
      //TODO: Make fields optional if not available
      authDto.email,
      authDto.password,
      authDto.phoneNumber ?? '',
      authDto.displayName ?? '',
      authDto.photoURL ?? '',
    );
  }

  // User Logging in
  @Get('login')
  getLoginPage() {
    return this.authService.getLoginPage();
  }

  @Post('login') //todo: Get data from DTO
  LoginUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.LoginUser(authDto.email, authDto.password);
  }

  // User Update Account Data

  @Get('update') //todo: Get data from DTO
  getUpdatePage(@Body() authDto: UpdateAuthDto) {
    return this.authService.getUpdatePage();
  }

  @Patch('update') //todo: Get data from DTO
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
  @Get('removeAccount') //todo: Get data from DTO
  getRemovePage(@Body() authDto: UpdateAuthDto) {
    return this.authService.getRemovePage();
  }

  @Delete('removeAccount') //todo: get data from DTO
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
}

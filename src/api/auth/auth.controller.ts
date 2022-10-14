import { Controller, Post, Body, Patch, Delete, Header } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Header('Content-Type', 'application/json')
  registerUser(@Body() userDetails: JSON) {
    const email = userDetails['email'];
    const password = userDetails['password'];
    const username = userDetails['username'];
    const phoneNumber = userDetails['phoneNumber'];
    return this.authService.signup(email, password, username, phoneNumber);
  }

  // User Logging in
  @Post('login')
  LoginUser(@Body() userCredentials: JSON) {
    const email = userCredentials['email'];
    const password = userCredentials['password'];
    const rememberMe = userCredentials['rememberMe'];
    return this.authService.Login(email, password, rememberMe);
  }

  // User Update Account Data

  @Patch('update')
  updateUser(@Body() userDetails: JSON) {
    const email = userDetails['email'];
    const phoneNumber = userDetails['phoneNumber'];
    const username = userDetails['username'];
    const photoURL = userDetails['photoURL'];
    const disabled = userDetails['disabled'];
    const password = userDetails['password'];
    return this.authService.updateUser(
      email,
      password,
      phoneNumber,
      username,
      photoURL,
      disabled,
    );
  }

  //User Remove User
  @Delete('remove') //todo: get data from DTO
  removeUser() {
    return this.authService.remove();
  }

  @Post('signout')
  signout() {
    return this.authService.signout();
  }

  @Post('passwordResetEmail') //Done by Omar
  passwordResetEmail(@Body() data: JSON) {
    const email = data['email'];

    return this.authService.passwordResetEmail(email);
  }

  @Post('confirmPasswordReset')
  resetPassword(@Body() data: JSON) {
    const oobCode = data['oobCode'];
    const password = data['password'];
    return this.authService.confirmPasswordReset(oobCode, password);
  }
}

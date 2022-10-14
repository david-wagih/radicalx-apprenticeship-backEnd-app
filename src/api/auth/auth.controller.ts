import { Controller, Post, Body, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  registerUser(@Body() userDetails: JSON) {
    const email = userDetails['email'];
    const password = userDetails['password'];
    const username = userDetails['username'];
    const phoneNumber = userDetails['phoneNumber'];
    return this.authService.signup(email, password, username, phoneNumber);
  }

  // User Logging in
  @Post('loginUser')
  LoginUser(@Body() userCredentials: JSON) {
    const email = userCredentials['email'];
    const password = userCredentials['password'];
    return this.authService.LoginUser(email, password);
  }

  // User Update Account Data

  @Patch('updateAccount')
  updateUser(@Body() userDetails: JSON) {
    const email = userDetails['email'];
    const phoneNumber = userDetails['phoneNumber'];
    const username = userDetails['username'];
    const photoURL = userDetails['photoURL'];
    const disabled = userDetails['disabled'];
    return this.authService.updateUser(
      email,
      phoneNumber,
      username,
      photoURL,
      disabled,
    );
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

  @Post('resetPassword')
  resetPassword(@Body() data: JSON) {
    const oobCode = data['oobCode'];
    const password = data['password'];
    return this.authService.resetPassword(oobCode, password);
  }

  //User Remove User
  @Delete('removeUser') //todo: get data from DTO
  removeUser() {
    return this.authService.removeUser();
  }

  @Post('resetPass')
  resetPass(@Body() data: JSON) {
    const email = data['email'];
    return this.authService.sendResetMail(email);
    //this.authService.sendMail(email);
  }
}

import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Header,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Header('Content-Type', 'application/json')
  async registerUser(@Request() request: Request, @Body() userDetails: JSON) {
    const authorizationHeader: string = request.headers['authorization'];
    const email = userDetails['email'];
    const password = userDetails['password'];
    const username = userDetails['username'];
    const phoneNumber = userDetails['phoneNumber'];
    return await this.authService.signup(
      authorizationHeader,
      email,
      password,
      username,
      phoneNumber,
    );
  }

  // User Logging in
  @Post('login')
  @Header('Content-Type', 'application/json')
  async LoginUser(@Request() request: Request, @Body() userCredentials: JSON) {
    const email = userCredentials['email'];
    const password = userCredentials['password'];
    const rememberMe = userCredentials['rememberMe'];
    const authorizationHeader: string = request.headers['authorization'];
    return await this.authService.Login(
      authorizationHeader,
      email,
      password,
      rememberMe,
    );
  }

  // User Update Account Data

  @Patch('update')
  @Header('Content-Type', 'application/json')
  async updateUser(@Request() request: Request, @Body() userDetails: JSON) {
    const authorizationHeader: string = request.headers['authorization'];
    const email = userDetails['email'];
    const phoneNumber = userDetails['phoneNumber'];
    const username = userDetails['username'];
    const photoURL = userDetails['photoURL'];
    const disabled = userDetails['disabled'];
    const password = userDetails['password'];
    return await this.authService.updateUser(
      authorizationHeader,
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
  async removeUser(@Request() request: Request) {
    const authorizationHeader: string = request.headers['authorization'];
    return await this.authService.remove(authorizationHeader);
  }

  @Post('signout')
  async signout(@Request() request: Request) {
    const authorizationHeader: string = request.headers['authorization'];
    return await this.authService.signout(authorizationHeader);
  }

  @Post('passwordResetEmail')
  @Header('Content-Type', 'application/json')
  async passwordResetEmail(@Request() request: Request, @Body() data: JSON) {
    const authorizationHeader: string = request.headers['authorization'];
    const email = data['email'];
    return await this.authService.passwordResetEmail(
      authorizationHeader,
      email,
    );
  }

  @Post('confirmPasswordReset')
  @Header('Content-Type', 'application/json')
  async resetPassword(@Request() request: Request, @Body() data: JSON) {
    const authorizationHeader: string = request.headers['authorization'];
    const oobCode = data['oobCode'];
    const password = data['password'];
    return await this.authService.confirmPasswordReset(
      authorizationHeader,
      oobCode,
      password,
    );
  }
}

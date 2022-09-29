import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Registration
  @Get('register')
  getRegistrationPage() {
    return this.authService.getRegistrationPage();
  }

  @Post('register')
  registerUser(@Body() authDto: CreateAuthDto) {
    return this.authService.registerUser(
      authDto.uid,
      authDto.email,
      authDto.emailVerified,
      authDto.phoneNumber,
      authDto.password,
      authDto.displayName,
      authDto.photoURL,
      authDto.disabled,
    );
  }

  // User Logging in
  @Get('login')
  getLoginPage() {
    return this.authService.getLoginPage();
  }

  @Post('login') //todo: Get data from DTO
  loginUser(@Req() req: Request, @Body() authDto: UpdateAuthDto) {
    return this.authService.loginUser(req, authDto.uid, authDto.password);
  }

  // User Update Account Data

  @Get('update') //todo: Get data from DTO
  getUpdatePage(@Body() authDto: UpdateAuthDto) {
    return this.authService.getUpdatePage(authDto.uid);
  }

  @Patch('update') //todo: Get data from DTO
  updateUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.updateUser(
      authDto.uid,
      authDto.email,
      authDto.emailVerified,
      authDto.phoneNumber,
      authDto.password,
      authDto.displayName,
      authDto.photoURL,
      authDto.disabled,
    );
  }

  //User Remove User
  @Get('removeAccount') //todo: Get data from DTO
  getRemovePage(@Body() authDto: UpdateAuthDto) {
    return this.authService.getRemovePage(authDto.uid);
  }

  @Delete('removeAccount') //todo: get data from DTO
  removeUser(@Body() authDto: UpdateAuthDto) {
    return this.authService.removeUser(authDto.uid);
  }
}

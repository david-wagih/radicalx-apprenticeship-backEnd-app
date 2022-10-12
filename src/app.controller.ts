import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ host: 'localhost' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  getHello(): string {
    return this.appService.getHello();
  }
}

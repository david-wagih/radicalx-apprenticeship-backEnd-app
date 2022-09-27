import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

// Controllers handles the requests and don't have any direct buisiness with the databases
// nest js defines the headers for the requests automatically
// but we can define our own as well

// your-domain.com

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  getHello(): string {
    return this.appService.getHello();
  }
}

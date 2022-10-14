import { Injectable } from '@nestjs/common';

// here we directly access data from database
// here happens the heavy logic and magic

@Injectable()
export class AppService {
  serverStatus(): string {
    return 'Hello From Nest JS app!';
  }
}

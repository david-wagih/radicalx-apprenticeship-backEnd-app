import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { DbModule } from './api/db/db.module';
import { ResizingModule } from './api/resizing/resizing.module';

// this is really important

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, DbModule, ResizingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

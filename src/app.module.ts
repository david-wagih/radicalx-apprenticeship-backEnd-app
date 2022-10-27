import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { DbModule } from './api/db/db.module';
import { StorageModule } from './api/storage/storage.module';
import { ResizingModule } from './api/resizing/resizing.module';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule, DbModule, StorageModule , ResizingModule],
  controllers: [AppController],
  providers: [AppService],

})
// this is really important

export class AppModule {}

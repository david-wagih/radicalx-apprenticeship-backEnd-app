import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';

@Module({
  imports: [],
  controllers: [DbController],
  providers: [DbService],
})
export class DbModule {}

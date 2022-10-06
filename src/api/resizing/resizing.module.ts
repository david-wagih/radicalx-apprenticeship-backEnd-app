import { Module } from "@nestjs/common";
import { ResizingController } from "./resizing.controller";
import { ResizingService } from "./resizing.service";

@Module({
    controllers: [ResizingController],
    providers: [ResizingService],
  })
  export class ResizingModule {}
import { Bind, Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResizingService } from "./resizing.service";


@Controller('uploads')
export class ResizingController {
    constructor(private readonly resizingService: ResizingService) {}

    @Get('upload')
    getUploadedFiles(){
        return this.resizingService.getUploadedFiles;
    }

    @Post('upload')
    uploadFile(){
        return this.resizingService.uploadFile;
    }    

    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file'))
    // @Bind(UploadedFile())
    // uploadFile(file) {
    // console.log(file);
    // }
    // uploadFileAndPassValidation(
    //   @UploadedFile(
    //     new ParseFilePipeBuilder()
    //       .addFileTypeValidator({
    //         fileType: 'jpeg',
    //       })
    //       .addMaxSizeValidator({
    //         maxSize: 1000
    //       })
    //       .build({
    //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    //       }),
    //   )
    //   file: Express.Multer.File,
    // ) {
    //   return {
    //     file: file.buffer.toString(),
    //   };
    // }
}
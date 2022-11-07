import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  uploadData(@Body() data, @UploadedFiles() files) {
    const companyVideo = data['companyVideo'];
    const companyLogo = data['companyLogo'];
    const apprenticeshipID = data['apprenticeshipID'];
    return this.storageService.uploadCompanyData(
      apprenticeshipID,
      companyVideo,
      companyLogo,
    );
  }

  @Patch()
  updateData(@Param() query: string[], @Body() data) {
    const apprenticeshipID = data['apprenticeshipID'];
    const companyVideo = data['companyVideo'];
    const companyLogo = data['companyLogo'];
    return this.storageService.updateCompanyData(
      apprenticeshipID,
      companyVideo,
      companyLogo,
    );
  }

  @Delete()
  removeData(@Param() query: string[]) {
    const apprenticeshipID = query['apprenticeshipID'];
    return this.storageService.removeCompanyData(apprenticeshipID);
  }
}

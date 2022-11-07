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

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadCompanyData/:apprenticeshipID')
  async uploadData(
    @Param() query: string[],
    @Body() data,
    @UploadedFiles() files,
  ) {
    const companyVideo = data['companyVideo'];
    const companyLogo = data['companyLogo'];
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.storageService.uploadCompanyData(
      apprenticeshipID,
      companyVideo,
      companyLogo,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch('update_apprenticeship/:apprenticeshipID')
  async updateData(@Param() query: string[], @Body() data) {
    const apprenticeshipID = query['apprenticeshipID'];
    const companyVideo = data['companyVideo'];
    const companyLogo = data['companyLogo'];
    return await this.storageService.updateCompanyData(
      apprenticeshipID,
      companyVideo,
      companyLogo,
    );
  }

  @Delete()
  async removeData(@Param() query: string[]) {
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.storageService.removeCompanyData(apprenticeshipID);
  }
}

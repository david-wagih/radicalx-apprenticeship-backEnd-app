import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { query } from 'express';
import { StorageService } from './storage.service';

@Controller({ path: 'storage' })
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  uploadData(@Body() data) {
    const companyVideo = data['companyVideo'];
    const companyLogo = data['companyLogo'];
    return this.storageService.uploadCompanyData(companyVideo, companyLogo);
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

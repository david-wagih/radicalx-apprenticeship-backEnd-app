import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller({ path: 'storage' })
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  uploadData(@Body() data) {
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

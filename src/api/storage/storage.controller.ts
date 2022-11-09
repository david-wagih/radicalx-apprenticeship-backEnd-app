import {
  Controller,
  Post,
  Patch,
  Param,
  Delete,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload_Company_Data/:apprenticeshipID')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'companyLogo' }, { name: 'companyVideo' }]),
  )
  async uploadCompanyData(
    @UploadedFiles()
    files: {
      companyLogo?: Express.Multer.File[];
      companyVideo?: Express.Multer.File[];
    },
    @Request() request: Request,
    @Param() query: string[],
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.storageService.uploadCompanyData(
      authorizationHeader,
      apprenticeshipID,
      files['companyLogo'],
      files['companyVideo'],
    );
  }

  @Patch('update_company_data/:apprenticeshipID')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'companyLogo' }, { name: 'companyVideo' }]),
  )
  async updateCompanyData(
    @UploadedFiles()
    files: {
      companyLogo?: Express.Multer.File[];
      companyVideo?: Express.Multer.File[];
    },
    @Request() request: Request,
    @Param() query: string[],
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.storageService.updateCompanyData(
      authorizationHeader,
      apprenticeshipID,
      files['companyLogo'],
      files['companyVideo'],
    );
  }

  @Delete('delete_company_data/:apprenticeshipID')
  async removeCompanyData(
    @Request() request: Request,
    @Param() query: string[],
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.storageService.removeCompanyData(
      authorizationHeader,
      apprenticeshipID,
    );
  }
}

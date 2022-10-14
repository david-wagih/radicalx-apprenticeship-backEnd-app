import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  uploadCompanyData(companyLogo: File, companyVideo: File) {
    //todo: Add the upload feature and return the references
    return {
      logo: 'companyLogo',
      video: 'companyVideo',
    };
  }
}

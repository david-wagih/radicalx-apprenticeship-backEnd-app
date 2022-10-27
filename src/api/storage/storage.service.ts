import { Body, Injectable, Param } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class StorageService {
  async uploadCompanyData(
    apprenticeshipID: string,
    companyLogo: File,
    companyVideo: File,
  ) {
    //todo: Add the upload feature and return the references
    const bucket = admin.storage().bucket();
    const imageOptions = {
      public: true,
      destination: 'Apprenticeships/',
      gzip: true,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
        contentType: 'image/png',
        cacheControl: 'public, max-age:31536000',
      },
    };
    const videoOptions = {
      public: true,
      destination: 'Apprenticeships/',
      gzip: true,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
        contentType: 'video/mp4',
        cacheControl: 'public, max-age:31536000',
      },
    };

    bucket.upload(companyVideo.name, videoOptions).then();
    const storage = await bucket.upload(companyVideo.name, videoOptions);
    console.log(storage[0].metadata.mediaLink);
    return storage[0].metadata.mediaLink;

    console.log({
      logo: 'companyLogo',
      video: 'companyVideo',
    });
    return {
      logo: 'companyLogo',
      video: 'companyVideo',
    };
  }

  updateCompanyData(
    apprenticeshipID: string,
    companyLogo: File,
    companyVideo: File,
  ) {
    this.removeCompanyData(apprenticeshipID);
    return this.uploadCompanyData(apprenticeshipID, companyLogo, companyVideo);
  }

  removeCompanyData(apprenticeshipID: string) {
    return 'Removed companyData';
  }
}

import { Injectable } from '@nestjs/common';
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
      destination: 'Apprenticeships/' + apprenticeshipID,
      gzip: true,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
        contentType: 'image/png',
        cacheControl: 'public, max-age:31536000',
      },
    };
    const videoOptions = {
      public: true,
      destination: 'Apprenticeships/' + apprenticeshipID,
      gzip: true,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
        contentType: 'video/mp4',
        cacheControl: 'public, max-age:31536000',
      },
    };
    const logo = await bucket.upload(companyLogo.name, imageOptions);
    const video = await bucket.upload(companyVideo.name, videoOptions);
    console.log({
      logo: 'Logo: ' + logo,
      video: 'Video: ' + video,
    });
    return {
      logo: logo,
      video: video,
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
    const deleteFilesOptions = {
      prefix: 'apprenticeships/' + apprenticeshipID + '/',
    };
    admin
      .storage()
      .bucket()
      .deleteFiles(deleteFilesOptions)
      .then(
        () => {
          console.log('Removed companyData successfully');
          return 'Removed companyData successfully';
        },
        (reason) => {
          console.error(reason);
        },
      );
  }
}

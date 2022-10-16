import { Body, Injectable, Param } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Injectable()
export class StorageService {
  uploadCompanyData(companyLogo: File, companyVideo: File) {
    //todo: Add the upload feature and return the references
    const bucket = admin.storage().bucket();
        const uploadOptions = {
            public: true,
            destination: "Apprenticeships/",
            gzip: true,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
                contentType: 'image/png',
                cacheControl: 'public, max-age:31536000',
            }
        };

        const storage = await bucket.upload(filePath, uploadOptions);
        console.log(storage[0].metadata.mediaLink);
        return (storage[0].metadata.mediaLink);


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
    return this.uploadCompanyData(companyLogo, companyVideo);
  }

  removeCompanyData(apprenticeshipID: string) {
    return 'Removed companyData';
  }
}

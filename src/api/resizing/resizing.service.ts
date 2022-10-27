import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResizingService {
  getUploadedFiles() {
    return 'This should be the uploaded files page';
  }

  async uploadFile(
    companyName: string,
    filePath: string,
    fileName: string,
    fileType: string,
  ) {
    const bucket = admin.storage().bucket();
    const uploadOptions = {
      public: true,
      destination: 'Companies/' + companyName + '/' + fileType + '/' + fileName,
      gzip: true,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
        contentType: 'image/png',
        cacheControl: 'public, max-age:31536000',
      },
    };

    const storage = await bucket.upload(filePath, uploadOptions);
    console.log(storage[0].metadata.mediaLink);
    return storage[0].metadata.mediaLink;
  }
}

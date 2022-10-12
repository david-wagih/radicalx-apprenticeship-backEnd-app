import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

const { v4: uuidv4 } = require('uuid');

@Injectable()
export class ResizingService {

    getUploadedFiles() {
        return 'This should be the uploaded files page';
    }

    async uploadFile(companyName: string, filePath: string, fileName: string, fileType: string) {

        const bucket = admin.storage().bucket();
        const uploadOptions = {
            public: true,
            destination: companyName + '/' + fileType + '/' + fileName,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            }
        };
        filePath = 'images/pic.png';
        const storage = await bucket.upload(filePath, uploadOptions);
        console.log(storage[0].metadata.mediaLink);
        return (storage[0].metadata.mediaLink);
    }
        
}

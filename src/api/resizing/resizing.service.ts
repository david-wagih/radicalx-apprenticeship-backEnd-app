import { Injectable, UploadedFile, ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';

// here we directly access data from database
// here happens the heavy logic and magic

const { v4: uuidv4 } = require('uuid');




@Injectable()
export class ResizingService {

    getUploadedFiles() {
        return 'This should be the uploaded files page';
    }

    async uploadFile(path: string, filename: string) {
        
        const bucket = admin.storage().bucket();

        // const metadata = {
        //     metadata: {
        //       firebaseStorageDownloadTokens: uuidv4()
        //     },
        //     contentType: 'image/png',
        //     cacheControl: 'public, max-age=31536000',
        //   };
        
        //   // Uploads a local file to the bucket
        //   const storage = await bucket.upload('images\pic.png', {
        //     // Support for HTTP requests made with `Accept-Encoding: gzip`
        //     gzip: true,
        //     metadata: metadata,
        //   });

        const storage = await bucket.upload("images/pic.png", {
            public: true,
            destination: '/uploads/mypic',
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            }
        });
          console.log(storage[0].metadata.mediaLink);
        return (storage[0].metadata.mediaLink);
    }
    
}

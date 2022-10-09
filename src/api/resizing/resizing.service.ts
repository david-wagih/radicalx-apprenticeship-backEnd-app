import { Injectable } from '@nestjs/common';

// here we directly access data from database
// here happens the heavy logic and magic

const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require("./path/to/serviceAccountKey.json");

const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

const storageRef = admin.storage().bucket('gs://corei14-apprenticeship-app.appspot.com');


@Injectable()
export class ResizingService {

    getUploadedFiles() {
        return 'This should be the uploaded files page';
    }

    async uploadFile(path, filename) {

        const storage = await storageRef.upload(path, {
            public: true,
            destination: '/uploads/${filename}',
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            }
        });

        return storage[0].metadata.mediaLink;
    }
    
}

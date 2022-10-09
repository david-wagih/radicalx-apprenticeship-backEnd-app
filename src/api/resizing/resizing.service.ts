import { Injectable, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ServiceAccount } from 'firebase-admin';
import { AppModule } from 'src/app.module';

// here we directly access data from database
// here happens the heavy logic and magic

const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');




@Injectable()
export class ResizingService {

    getUploadedFiles() {
        return 'This should be the uploaded files page';
    }

    async uploadFile(path: any, filename: any) {
        const app = await NestFactory.create(AppModule);
        app.useGlobalPipes(new ValidationPipe());
        const configService: ConfigService = app.get(ConfigService);
        const port: string = configService.get<string>('API_PORT');
        const database_url: string = configService.get<string>('DB_URL');
        const serviceAccount: ServiceAccount = {
            projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
            privateKey: configService
              .get<string>('FIREBASE_PRIVATE_KEY')
              .replace(/\\n/g, '\n'),
            clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          };
        
        const admin = firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(serviceAccount),
            databaseURL: database_url,
        });
        
        const storageRef = admin.storage().bucket('gs://corei14-apprenticeship-app.appspot.com');

        const storage = await storageRef.upload(path, {
            public: true,
            destination: '/uploads/${filename}',
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            }
        });

        return storage[0].metadata.mediaLink;
    }

    //Test the upload function

    // (async() => {
    //     const url = await uploadFile('./mypic.png', "my-image.png");
    //     console.log(url);
    // })();
    
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ValidationPipe } from '@nestjs/common';
import { getAuth } from 'firebase/auth';
import * as FirebaseApp from 'firebase/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService: ConfigService = app.get(ConfigService);
  const adminConfig: admin.ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };
  const port: string = configService.get<string>('API_PORT');
  const database_url: string = configService.get<string>('DB_URL');
  

  const firebaseConfig = { //TODO: Move to .env
    apiKey: "AIzaSyAbZPOEllKWNFZx9FXBEYBEweDCd0ynOMw",
    authDomain: "corei14-apprenticeship-app.firebaseapp.com",
    databaseURL: "https://corei14-apprenticeship-app-default-rtdb.firebaseio.com",
    projectId: "corei14-apprenticeship-app",
    storageBucket: "corei14-apprenticeship-app.appspot.com",
    messagingSenderId: "338043954968",
    appId: "1:338043954968:web:335bcc5297cee0dcbde06d"
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: database_url,
  });
  FirebaseApp.initializeApp(firebaseConfig);

  app.enableCors();
  await app.listen(port, () =>
    console.log('Server running on http://localhost:' + port),
  );
}
bootstrap();
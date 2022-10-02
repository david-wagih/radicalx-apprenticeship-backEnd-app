import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

// Import firebase-admin
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// import { initializeApp, applicationDefault } from 'firebase-admin/app';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: string = configService.get<string>('API_PORT');
  const database_url: string = configService.get<string>('DB_URL');
  // Set the config options
  const adminConfig: ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };
  // Initialize the firebase admin app
  // todo : the database URL to be changes of Course

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: database_url,
  });

  
  // initializeApp({
  //   credential: applicationDefault(),
  //   projectId: 'corei14-apprenticeship-app',
  // });

  app.enableCors();

  await app.listen(port, () =>
    console.log('Server running on http://localhost:' + port),
  );
}
bootstrap();

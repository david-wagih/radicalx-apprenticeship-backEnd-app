import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import firebaseAdmin from 'firebase-admin';
import {
  initializeApp as firebaseAppInit,
  FirebaseOptions as firebaseAppOptions,
} from 'firebase/app';

async function runApp() {
  // Application setup
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();

  //Environtment Variables Setup
  const env = {
    domain: configService.get<string>('server_domain'),
    port: configService.get<string>('server_port'),
  };

  //Firebase configuration
  const firebaseAdminConfig: firebaseAdmin.ServiceAccount = {
    projectId: configService.get<string>('project_id'),
    privateKey: configService.get<string>('private_key').replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('client_email'), 
  };

  const firebaseOptions: firebaseAppOptions = {
    apiKey: configService.get<string>('api_key'),
    authDomain: configService.get<string>('auth_domain'),
    databaseURL: configService.get<string>('db_uri'),
    projectId: configService.get<string>('project_id'),
    storageBucket: configService.get<string>('storage_uri'),
    messagingSenderId: configService.get<string>('messaging_sender_id'),
    appId: configService.get<string>('app_id'),
  };

  //Initialize Firebase app
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseAdminConfig),
    databaseURL: firebaseOptions.databaseURL,
    storageBucket: configService.get<string>('storage_uri'),
  });
  firebaseAppInit(firebaseOptions);

  //Starting the server
  await app.listen(env.port, () =>
    console.log('Server running on http://' + env.domain + ':' + env.port),
  );
}

runApp();

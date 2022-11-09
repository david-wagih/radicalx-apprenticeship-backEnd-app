import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AuthService } from '../auth/auth.service';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class StorageService {
  async uploadCompanyData(
    authorizationHeader: string,
    apprenticeshipID: string,
    companyLogo: Express.Multer.File[],
    companyVideo: Express.Multer.File[],
  ) {
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      const bucket = admin.storage().bucket();
      const imageOptions = {
        public: true,
        destination:
          'Apprenticeships/' +
          apprenticeshipID +
          '/Resources/' +
          companyLogo[0]['originalname'],
        //gzip: true,
        metadata: {
          contentType: companyLogo[0]['mimetype'],
          firebaseStorageDownloadTokens: uuidv4(),
          cacheControl: 'public, max-age:31536000',
        },
      };
      const videoOptions = {
        public: true,
        destination:
          'Apprenticeships/' +
          apprenticeshipID +
          '/Resources/' +
          companyVideo[0]['originalname'],
        //gzip: true,
        metadata: {
          contentType: companyVideo[0]['mimetype'],
          firebaseStorageDownloadTokens: uuidv4(),
          cacheControl: 'public, max-age:31536000',
        },
      };
      const logoRef = await bucket.upload(companyLogo[0]['path'], imageOptions);
      fs.unlink(companyLogo[0]['path'], (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      const videoRef = await bucket.upload(
        companyVideo[0]['path'],
        videoOptions,
      );
      fs.unlink(companyVideo[0]['path'], (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Files uploaded');
        return {
          logo: logoRef,
          video: videoRef,
        };
      });
    } else {
      console.log('You need to login first');
      return 'You need to login first';
    }
  }

  async updateCompanyData(
    authorizationHeader: string,
    apprenticeshipID: string,
    companyLogo: Express.Multer.File[],
    companyVideo: Express.Multer.File[],
  ) {
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      this.removeCompanyData(authorizationHeader, apprenticeshipID);
      return this.uploadCompanyData(
        authorizationHeader,
        apprenticeshipID,
        companyLogo,
        companyVideo,
      );
    } else {
      console.log('You need to login first');
      return 'You need to login first';
    }
  }

  async removeCompanyData(
    authorizationHeader: string,
    apprenticeshipID: string,
  ) {
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      const deleteFilesOptions = {
        prefix: 'apprenticeships/' + apprenticeshipID + '/',
        //gzip: true,
        public: true,
      };
      await admin.storage().bucket().deleteFiles(deleteFilesOptions);
      console.log('Removed company data  successfully');
      return 'Removed company data successfully';
    } else {
      console.log('You need to login first');
      return 'You need to login first';
    }
  }
}

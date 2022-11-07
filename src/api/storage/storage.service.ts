import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class StorageService {
  uploadCompanyData(
    apprenticeshipID: string,
    companyLogo: File,
    companyVideo: File,
  ) {
    return {
      video: 'video',
      logo: 'logo',
    };
    //todo: Add the upload feature and return the references
    // const bucket = admin.storage().bucket();
    // const imageOptions = {
    //   public: true,
    //   destination: 'Apprenticeships/' + apprenticeshipID,
    //   gzip: true,
    //   metadata: {
    //     firebaseStorageDownloadTokens: uuidv4(),
    //     contentType: 'image/png',
    //     cacheControl: 'public, max-age:31536000',
    //   },
    // };
    // const videoOptions = {
    //   public: true,
    //   destination: 'Apprenticeships/' + apprenticeshipID,
    //   gzip: true,
    //   metadata: {
    //     firebaseStorageDownloadTokens: uuidv4(),
    //     contentType: 'video/mp4',
    //     cacheControl: 'public, max-age:31536000',
    //   },
    // };
    // const logo = await bucket.upload(companyLogo.name, imageOptions);
    // const video = await bucket.upload(companyVideo.name, videoOptions);
    // console.log({
    //   logo: 'Logo: ' + logo,
    //   video: 'Video: ' + video,
    // });
    // return {
    //   logo: logo,
    //   video: video,
    // };
  }

  updateCompanyData(
    apprenticeshipID: string,
    companyLogo: File,
    companyVideo: File,
  ) {
    this.removeCompanyData(apprenticeshipID);
    return this.uploadCompanyData(apprenticeshipID, companyLogo, companyVideo);
  }
  removeCompanyData(apprenticeshipID: string) {
    console.log('Company Date Delete');
    return 'Company Data Deleted';
    const deleteFilesOptions = {
      prefix: 'apprenticeships/' + apprenticeshipID + '/',
    };
    admin
      .storage()
      .bucket()
      .deleteFiles(deleteFilesOptions)
      .then(
        () => {
          console.log('Removed companyData successfully');
          return 'Removed companyData successfully';
        },
        (reason) => {
          console.error(reason);
        },
      );
  }

  // async uploadFile(
  //   companyName: string,
  //   filePath: string,
  //   fileName: string,
  //   fileType: string,
  // ) {
  //   const bucket = admin.storage().bucket();
  //   const uploadOptions = {
  //     public: true,
  //     destination: 'Companies/' + companyName + '/' + fileType + '/' + fileName,
  //     gzip: true,
  //     metadata: {
  //       firebaseStorageDownloadTokens: uuidv4(),
  //       contentType: 'image/png',
  //       cacheControl: 'public, max-age:31536000',
  //     },
  //   };

  //   const storage = await bucket.upload(filePath, uploadOptions);
  //   console.log(storage[0].metadata.mediaLink);
  //   return storage[0].metadata.mediaLink;
  // }

  // uploadFileAndPassValidation(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'jpeg',
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 1000
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  //       }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return {
  //     file: file.buffer.toString(),
  //   };
  // }
}

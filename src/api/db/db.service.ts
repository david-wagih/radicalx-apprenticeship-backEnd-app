import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class DbService {
  // create() {
  //   admin
  //     .firestore()
  //     .collection('user')
  //     .add({
  //       email: 'tester2@test.test',
  //       password: 'test321',
  //     })
  //     .then(() => {
  //       console.log('Add record successfully');
  //       return 'added record successfully';
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  //   return 'This action adds a new db';
  // }

  getUserApprenticeships(userID: string) {
    return 'Apprenticeships List for user ' + userID;
  }

  async createApprenticeship(
    creator: string,
    companyTitle: string,
    companyLogo: File,
    companyDescription: string,
    companyVideo: File,
    apprenticeshipTitle: string,
    apprenticeshipDescription: string,
    teamType: string,
    teamRoles: [],
    teamAdmins: [],
    timeline: [],
  ) {
    // todo: upload video and image and get reference
    const companyData = {
      description: companyDescription,
    };

    const apprenticeshipData = {
      apprenticeshipDescription: companyDescription,
      teamType: teamType,
      teamRoles: teamRoles,
      teamAdmins: teamAdmins,
      timeline: timeline,
      creator: creator,
    };
    try {
      const companyRecord = await admin
        .firestore()
        .collection('Companies')
        .doc(companyTitle)
        .get();
      if (!companyRecord.exists) {
        const references = StorageService.prototype.uploadCompanyData(
          companyLogo,
          companyVideo,
        );
        const companyVideoReference = references['video'];
        const companyLogoReference = references['logo'];
        await admin
          .firestore()
          .collection('Companies')
          .doc(companyTitle)
          .set(companyData);
      } else {
        admin
          .firestore()
          .collection('Companies')
          .doc(companyTitle)
          .collection('apprenticeships')
          .doc(apprenticeshipTitle)
          .set(apprenticeshipData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  deleteApprenticeship(id: string) {
    return 'Deleted apprenticeship for user ' + id;
  }
}

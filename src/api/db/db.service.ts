import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DbService {
  createUserRecord(userID: string) {
    admin.firestore().collection('Users').doc(userID).set({
      apprenticeships: [],
    });
  }

  async getUserApprenticeships(authorizationHeader: string, userID: string) {
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      const apprenticeships = await admin
        .firestore()
        .collection('Apprenticeships')
        .where('creator', 'in', [userID])
        .get();
      return apprenticeships.docs.map((doc) => ({
        apprenticeshipID: doc.id,
        apprenticeshipData: doc.data(),
      }));
    } else {
      console.log('User needs to log in first');
      return 'User needs to log in first';
    }
  }
  async getApprenticeship(
    authorizationHeader: string,
    userID: string,
    apprenticeshipID: string,
  ) {
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      const apprenticeships = await admin
        .firestore()
        .collection('Apprenticeships')
        .where('creator', 'in', [userID])
        .get();
      return apprenticeships.docs
        .map((doc) => ({
          apprenticeshipID: doc.id,
          apprenticeshipData: doc.data(),
        }))
        .filter(
          (apprenticeship) =>
            apprenticeship.apprenticeshipID === apprenticeshipID,
        );
    } else {
      console.log('User needs to log in first');
      return 'User needs to log in first';
    }
  }

  async createApprenticeship(
    authorizationHeader: string,
    creator: string,
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
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      // todo: upload video and image and get reference
      const references = StorageService.prototype.uploadCompanyData(
        apprenticeshipTitle,
        companyLogo,
        companyVideo,
      );
      const companyVideoReference = references['video'];
      const companyLogoReference = references['logo'];
      // todo: Create Apprenticeship
      const apprenticeshipData = {
        creator: creator,
        companyLogo: companyLogoReference,
        companyDescription: companyDescription,
        companyVideo: companyVideoReference,
        apprenticeshipTitle: apprenticeshipTitle,
        apprenticeshipDescription: apprenticeshipDescription,
        teamType: teamType,
        teamRoles: teamRoles,
        teamAdmins: teamAdmins,
        timeline: timeline,
      };
      admin
        .firestore()
        .collection('Apprenticeships')
        .add(apprenticeshipData)
        .then(
          (
            apprenticeshipRef: admin.firestore.DocumentReference<admin.firestore.DocumentData>,
          ) => {
            admin
              .firestore()
              .collection('Users')
              .doc(creator)
              .update({
                apprenticeships: admin.firestore.FieldValue.arrayUnion(
                  apprenticeshipRef.id,
                ),
              })
              .then(
                (result: admin.firestore.WriteResult) => {
                  console.log(result);
                  return result;
                },
                (reason) => {
                  console.error(reason);
                },
              );
          },
          (reason: string) => {
            console.error(reason);
          },
        );
    } else {
      console.log('User needs to log in first');
      return 'User needs to log in first';
    }
  }

  async updateApprenticeship(
    authorizationHeader: string,
    apprenticeshipID: string,
    creator: string,
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
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      const references = StorageService.prototype.uploadCompanyData(
        apprenticeshipTitle,
        companyLogo,
        companyVideo,
      );
      const companyVideoReference = references['video'];
      const companyLogoReference = references['logo'];
      const apprenticeshipData = {
        creator: creator,
        companyLogo: companyLogoReference,
        companyDescription: companyDescription,
        companyVideo: companyVideoReference,
        apprenticeshipTitle: apprenticeshipTitle,
        apprenticeshipDescription: apprenticeshipDescription,
        teamType: teamType,
        teamRoles: teamRoles,
        teamAdmins: teamAdmins,
        timeline: timeline,
      };
      await admin
        .firestore()
        .collection('Apprenticeships')
        .doc(apprenticeshipID)
        .update(apprenticeshipData);
    } else {
      console.log('User needs to log in first');
      return 'User needs to log in first';
    }
  }

  async duplicateApprenticeship(
    authorizationHeader: string,
    apprenticeshipID: string,
  ) {
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      const oldApprenticeship = await admin
        .firestore()
        .collection('Apprenticeships')
        .doc(apprenticeshipID)
        .get();
      const newApprenticeship = await admin
        .firestore()
        .collection('Apprenticeships')
        .add(oldApprenticeship.data());
      const creator: string = oldApprenticeship.data()['creator'];
      admin
        .firestore()
        .collection('Users')
        .doc(creator)
        .update({
          apprenticeships: admin.firestore.FieldValue.arrayUnion(
            newApprenticeship.id,
          ),
        });
      console.log('Apprenticehsip duplicated');
      return 'Apprenticehsip duplicated';
    } else {
      console.log('User needs to log in first');
      return 'User needs to log in first';
    }
  }

  async deleteApprenticeship(
    authorizationHeader: string,
    apprenticeshipID: string,
  ) {
    if (AuthService.prototype.checkUser(authorizationHeader)) {
      admin
        .firestore()
        .collection('Apprenticeships')
        .doc(apprenticeshipID)
        .get()
        .then(
          (
            apprenticeshipData: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>,
          ) => {
            const userID = apprenticeshipData.data()['creator'];
            admin
              .firestore()
              .collection('Apprenticeships')
              .doc(apprenticeshipID)
              .delete()
              .then(
                () => {
                  StorageService.prototype.removeCompanyData(apprenticeshipID);
                  admin
                    .firestore()
                    .collection('Users')
                    .doc(userID)
                    .update({
                      apprenticeships:
                        admin.firestore.FieldValue.arrayRemove(
                          apprenticeshipID,
                        ),
                    })
                    .then(
                      () => {
                        console.log('Deleted apprenticeship');
                        return 'Deleted apprenticeship';
                      },
                      (reason) => {
                        console.error(reason);
                      },
                    );
                },
                (reason: string) => {
                  console.error(reason);
                },
              );
          },
          (reason) => {
            console.error(reason);
          },
        );
    } else {
      console.log('User needs to log in first');
      return 'User needs to log in first';
    }
  }
}

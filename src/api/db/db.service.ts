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

  createUserRecord(userID: string) {
    admin.firestore().collection('Users').doc(userID).set({
      apprenticeships: [],
    });
  }

  getUserApprenticeships(userID: string) {
    const apprenticeships = [];
    admin
      .firestore()
      .collection('Apprenticeships')
      .where('creator', 'in', userID)
      .get()
      .then(
        (
          apprenticeshipList: admin.firestore.QuerySnapshot<admin.firestore.DocumentData>,
        ) => {
          apprenticeshipList.docs.forEach(
            (
              apprenticeship: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>,
            ) => {
              //Getting the data required per appreticeship
              const teamRoles = [];
              const teamAdmins = [];
              apprenticeship.data()['teamRoles'].foreach((teamRole) => {
                const roleName = teamRole['roleName'];
                const roleDescription = teamRole['roleDescription'];
                const requiredSkills = teamRole['RequiredSkills'];
                const complementarySkills = teamRole['ComplementarySkills'];
                const minHours = teamRole['minHours'];
                const locationPreferences = teamRole['locationPreferences'];
                teamRoles.push({
                  roleName: roleName,
                  roleDescription: roleDescription,
                  requiredSkills: requiredSkills,
                  complementarySkills: complementarySkills,
                  minHours: minHours,
                  locationPreferences: locationPreferences,
                });
              });
              apprenticeship.data()['teamAdmins'].foreach((teamAdmin) => {
                teamAdmins.push({
                  name: teamAdmin['name'],
                  email: teamAdmin['email'],
                  linkedin: teamAdmin['linkedin'],
                  logo: teamAdmin['logo'],
                });
              });
              // Push into apprenticeship List
              apprenticeships.push({
                id: apprenticeship.id,
                apprenticeshipData: {
                  apprenticeshipTitle:
                    apprenticeship.data()['apprenticeshipTitle'],
                  companyLogo: apprenticeship.data()['companyLogo'],
                  companyDescription:
                    apprenticeship.data()['companyDescription'],
                  apprenticeshipDescription:
                    apprenticeship.data()['apprenticeshipDescription'],
                  companyVideo: apprenticeship.data()['companyLogo'],
                  teamType: apprenticeship.data()['teamType'],
                  teamRoles: teamRoles,
                  teamAdmins: teamAdmins,
                  timeline: {
                    startDate: apprenticeship.data()['timeline']['startDate'],
                    endDate: apprenticeship.data()['timeline']['endDate'],
                  },
                },
              });
            },
          );
          return apprenticeships;
        },
        (reason) => {
          console.error(reason);
        },
      );
  }

  createApprenticeship(
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
    const references = StorageService.prototype.uploadCompanyData(
      companyLogo,
      companyVideo,
    );
    const companyVideoReference = references['video'];
    const companyLogoReference = references['logo'];
    // todo: Create Apprenticeship
    const apprenticeshipData = {
      creator: creator,
      companyTitle: companyTitle,
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
  }

  deleteApprenticeship(apprenticeshipID: string) {
    admin
      .firestore()
      .collection('Apprenticeships')
      .doc(apprenticeshipID)
      .get()
      .then(
        (
          apprenticeshipData: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>,
        ) => {
          const userID = apprenticeshipData.data['creator'];
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
                      admin.firestore.FieldValue.arrayRemove(apprenticeshipID),
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
  }
}

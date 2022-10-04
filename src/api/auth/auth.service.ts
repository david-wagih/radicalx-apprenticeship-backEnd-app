import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  getRegistrationPage() {
    //Add registration page from Front-end team
    console.log('This should be the registration page');
    return 'This should be the registration page';
  }

  registerUser(
    // todo: set arguments as optional
    uid: string,
    email: string,
    emailVerified: boolean,
    phoneNumber: string,
    password: string,
    displayName: string,
    photoURL: string,
    disabled: boolean,
  ) {
    admin
      .auth()
      .createUser({
        uid: uid,
        email: email,
        emailVerified: emailVerified,
        phoneNumber: phoneNumber,
        password: password,
        displayName: displayName,
        photoURL: photoURL,
        disabled: disabled,
      })
      .then((userRecord) => {
        console.log('Created user ' + userRecord.displayName + ' successfully');
        return 'Created user ' + userRecord.displayName + ' successfully';
      }) //todo: add email verification
      .catch((error) => console.error(error));
  }

  getLoginPage() {
    //todo: add login page
    console.log('This should be the registration page');
    return 'this should be the login page';
  }

  loginUser(req: Request, uid: string, password: string) {
    // todo: Add social logins
    const token = req.headers.get('Authorization');
    if (token != null && token != '') {
      admin
        .auth()
        .verifyIdToken(token.replace('Bearer', ''))
        .then(async (decodedToken) => {
          const user = {
            uid: decodedToken.uid,
          };
          req['user'] = user;
          return user;
        })
        .catch((err) => {
          console.error('Error: ' + err.message);
        });
    }
    console.error('Error! Header is empty');
  }

  getUpdatePage(uid: string) {
    // todo: add update page
    console.log('this should be the update page for ' + uid);
    return 'this should be the update page for ' + uid;
  }

  updateUser(
    // todo: check user authentication
    // todo: set arguments as optional
    uid: string,
    email: string,
    emailVerified: boolean,
    phoneNumber: string,
    password: string,
    displayName: string,
    photoURL: string,
    disabled: boolean,
  ) {
    admin.auth().
    admin
      .auth()
      .updateUser(uid, {
        email: email,
        emailVerified: emailVerified,
        phoneNumber: phoneNumber,
        password: password,
        displayName: displayName,
        photoURL: photoURL,
        disabled: disabled,
      })
      .then((userRecord) => {
        console.log('Successfully updated user ' + userRecord.displayName);
        return 'Successfully updated user ' + userRecord.displayName;
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  }

  getRemovePage(uid: string) {
    // todo: add the remove page
    console.log('this should be the delete user for ' + uid);
    return 'this should be the delete user for ' + uid;
  }

  removeUser(uid: string) {
    // todo: authenticate user
    admin
      .auth()
      .deleteUser(uid)
      .then(() => {
        console.log('Deleted user ' + uid + ' successfully');
        return 'Deleted user ' + uid + 'sussessfully';
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }
}

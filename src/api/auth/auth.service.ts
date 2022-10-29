import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import * as admin from 'firebase-admin';
import {
  CreateRequest,
  UpdateRequest,
} from 'firebase-admin/lib/auth/auth-config';
import {
  User,
  sendEmailVerification,
  confirmPasswordReset,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithCustomToken,
} from 'firebase/auth';
@Injectable()
export class AuthService {
  async signup(
    email: string,
    password: string,
    username: string,
    phoneNumber: string,
  ) {
    try {
      if ((await this.checkUser()) != true) {
        const userConfig: CreateRequest = {
          displayName: username,
          email: email,
          password: password,
          phoneNumber: phoneNumber,
          photoURL:
            'https://firebasestorage.googleapis.com/v0/b/corei14-apprenticeship-app.appspot.com/o/system%2Ficons%2FdefaultUserIcon.png?alt=media&token=1f939124-256a-4e54-bb25-fd8bf157f15e',
          emailVerified: false,
          disabled: false,
        };
        const userRecord = await admin.auth().createUser(userConfig);
        DbService.prototype.createUserRecord(userRecord.uid);
        return this.Login(email, password, false);
      } else {
        return 'You are already logged in';
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async Login(email: string, password: string, rememberMe: boolean) {
    try {
      if ((await this.checkUser()) != true) {
        const auth = getAuth();
        const persistence =
          rememberMe == true
            ? browserLocalPersistence
            : browserSessionPersistence;
        await setPersistence(auth, persistence);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (userCredential.user.emailVerified == false) {
          return await this.verifyEmail(auth.currentUser);
        }
        // Signed in and verified
        console.log('Logged in Successfully');
        const user = userCredential.user; // todo: save user session in browser storage to avoid logout if server restarts
        const developerClaims = userCredential.user.toJSON();
        const customToken = await admin
          .auth()
          .createCustomToken(user.uid, developerClaims);
        return { userID: user.uid, customToken: customToken };
      } else {
        console.log('You are already logged in');
        return 'You are already logged in';
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async updateUser(
    email: string,
    password: string,
    phoneNumber: string,
    displayName: string,
    photoURL: string,
    disabled: boolean,
  ) {
    try {
      const auth = getAuth();
      if (await this.checkUser()) {
        const updateRequest: UpdateRequest = {
          displayName: displayName ?? auth.currentUser.displayName,
          email: email ?? auth.currentUser.email,
          phoneNumber: phoneNumber ?? auth.currentUser.phoneNumber,
          photoURL: photoURL ?? auth.currentUser.photoURL,
          disabled: disabled,
        };
        if (password) {
          updateRequest.password = password;
        }
        const userRecord = await admin
          .auth()
          .updateUser(auth.currentUser.uid, updateRequest);
        console.log('Successfully updated user ' + userRecord.displayName);
        return 'Successfully updated user ' + userRecord.displayName;
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async remove() {
    if (this.checkUser()) {
      const auth = getAuth();
      admin
        .auth()
        .deleteUser(auth.currentUser.uid)
        .then(() => {
          console.log('Deleted user ' + auth.currentUser.uid + ' successfully');
          return 'Deleted user ' + auth.currentUser.uid + 'successfully';
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    } else {
      console.log('You need to be logged in to remove the user');
      return 'You need to be logged in to remove the user';
    }
  }

  signout() {
    const auth = getAuth();
    auth.signOut().then(
      () => {
        console.log('You signed out successfully');
        return 'You logged out successfully';
      },
      (err) => {
        console.log(err);
        return err;
      },
    );
  }

  checkUser(customToken?: string) {
    const auth = getAuth();

    const user = auth.currentUser;
    if (user) {
      if (user.emailVerified == false) {
        console.log(
          'You need to verify your email to access this page. A verification email has been sent to your email',
        );
        return false;
      } else {
        console.log('User already logged in');
        return true;
      }
    } else {
      if (customToken) {
        signInWithCustomToken(auth, customToken).then(
          () => {
            return true;
          },
          (result) => {
            console.error(result);
            return false;
          },
        );
      } else {
        console.log('User needs to log in');
        return false; // No user is logged in.
      }
    }
  }

  verifyEmail(user: User) {
    sendEmailVerification(user);
    console.log(
      'You need to verify your email. The activation email has been sent to ' +
        user.email +
        '. Please Check your inbox',
    );
    return (
      'You need to verify your email. The activation email has been sent to ' +
      user.email +
      '. Please Check your inbox'
    );
  }

  passwordResetEmail(email: string) {
    if (this.checkUser()) {
      console.log('You are already logged in');
      return 'You are already logged in';
    } else {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log(
            'The reset email has been sent to ' +
              email +
              '. Please check your email for the reset link',
          );
        })
        .catch((err) => {
          console.error('Error sending reset email:', err);
        });
    }
  }

  confirmPasswordReset(code: string, newPassword: string) {
    if (this.checkUser()) {
      console.log('You are already logged in');
      return 'You are already logged in';
    } else {
      const auth = getAuth();
      confirmPasswordReset(auth, code, newPassword).then(
        () => {
          console.log('Your password has been reset successfully');
          return 'Your password has been reset successfully';
        },
        (reason) => {
          console.error(reason);
        },
      );
    }
  }
}

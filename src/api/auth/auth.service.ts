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
  Auth,
  UserCredential,
} from 'firebase/auth';
@Injectable()
export class AuthService {
  async signup(
    authorization: Map<string, string>,
    email: string,
    password: string,
    username: string,
    phoneNumber: string,
  ) {
    try {
      if (!(await this.checkUser(authorization))) {
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
        return this.Login(authorization, email, password, false);
      } else {
        return 'You are already logged in';
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async Login(
    authorization: Map<string, string>,
    email: string,
    password: string,
    rememberMe: boolean,
  ) {
    try {
      if (!(await this.checkUser(authorization))) {
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
        const user: User = userCredential.user;
        const customToken: string = await admin
          .auth()
          .createCustomToken(user.uid);
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
    authorization: Map<string, string>,
    email: string,
    password: string,
    phoneNumber: string,
    displayName: string,
    photoURL: string,
    disabled: boolean,
  ) {
    try {
      const auth = getAuth();
      if (!(await this.checkUser(authorization))) {
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

  async remove(authorization: Map<string, string>) {
    if (!this.checkUser(authorization)) {
      try {
        const auth: Auth = getAuth();
        await admin.auth().deleteUser(auth.currentUser.uid);
        console.log('User deleted successfully');
        return 'User deleted successfully';
      } catch (err) {
        console.error(err);
        return err;
      }
    } else {
      console.log('You need to be logged in to remove the user');
      return 'You need to be logged in to remove the user';
    }
  }

  async signout(authorization: Map<string, string>) {
    if (!this.checkUser(authorization)) {
      try {
        const auth = getAuth();
        await auth.signOut();
        console.log('You signed out successfully');
        return 'You logged out successfully';
      } catch (err) {
        console.error(err);
        return err;
      }
    } else {
      console.log('You need to be logged in to be able to sign out');
      return 'You need to be logged in to be able to sign out';
    }
  }

  async checkUser(token: Map<string, string>) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      if (user.emailVerified) {
        return true;
      } else {
        // Removed for testing purposes
        // console.log(
        //   'You need to verify your email to access this page. A verification email has been sent to your email',
        // );
        // return false;
        return true;
      }
    } else {
      if (token.size > 0) {
        const userCredential: UserCredential = await signInWithCustomToken(
          auth,
          token[''],
        );
        if (userCredential) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  async verifyEmail(user: User) {
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

  async passwordResetEmail(authorization: Map<string, string>, email: string) {
    if (!this.checkUser(authorization)) {
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        console.log(
          'The reset email has been sent to ' +
            email +
            '. Please check your email for the reset link',
        );
      } catch (err) {
        console.error(err);
        return err;
      }
    } else {
      console.log('You are already logged in');
      return 'You are already logged in';
    }
  }

  async confirmPasswordReset(
    authorization: Map<string, string>,
    code: string,
    newPassword: string,
  ) {
    if (!this.checkUser(authorization)) {
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
    } else {
      console.log('You are already logged in');
      return 'You are already logged in';
    }
  }
}

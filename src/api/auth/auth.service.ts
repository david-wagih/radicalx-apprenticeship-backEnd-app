import { Injectable } from '@nestjs/common';
import {DbService} from '../db/db.service'
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
  signup(
    email: string,
    password: string,
    username: string,
    phoneNumber: string,
  ) {
    if (this.checkUser() != true) {
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
      admin
        .auth()
        .createUser(userConfig)
        .then(
          () => {
            DbService.prototype.createUserRecord(userConfig.uid);
            this.Login(email, password, false);
          },
          (reason) => {
            console.error(reason);
            return reason;
          },
        );
    } else {
      console.log('You are already logged in');
      return 'You are already logged in';
    }
  }

  Login(email: string, password: string, rememberMe: boolean) {
    if (this.checkUser() != true) {
      const auth = getAuth();
      const persistence =
        rememberMe == true
          ? browserLocalPersistence
          : browserSessionPersistence;
      setPersistence(auth, persistence)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              if (userCredential.user.emailVerified == false) {
                return this.verifyEmail(auth.currentUser);
              } else {
                // Signed in and verified
                console.log('Logged in Successfully');
                const user = userCredential.user; // todo: save user session in browser storage to avoid logout if server restarts
                const developerClaims = user.toJSON();

                admin
                  .auth()
                  .createCustomToken(user.uid, developerClaims)
                  .then((customToken) => {
                    console.log(customToken);
                    return customToken; // Send token back to client
                  })
                  .catch((error) => {
                    console.log('Error creating custom token:', error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('You are already logged in');
      return 'You are already logged in';
    }
  }

  getUpdatePage() {
    if (this.checkUser()) {
      const auth = getAuth();
      console.log(
        'this should be the update page for ' + auth.currentUser.displayName,
      );
      return (
        'this should be the update page for ' + auth.currentUser.displayName
      );
    } else {
      console.log('You need to login to update the user');
      return 'you need to login to update the user';
    }
    // todo: add update page
  }

  updateUser(
    email: string,
    password: string,
    phoneNumber: string,
    displayName: string,
    photoURL: string,
    disabled: boolean,
  ) {
    const auth = getAuth();
    if (this.checkUser()) {
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
      admin
        .auth()
        .updateUser(auth.currentUser.uid, updateRequest)
        .then((userRecord) => {
          console.log('Successfully updated user ' + userRecord.displayName);
          return 'Successfully updated user ' + userRecord.displayName;
        })
        .catch((error) => {
          console.error('Error updating user:', error);
        });
    }
  }

  remove() {
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
      }
      console.log('User already logged in');
      return true; //User is logged in
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

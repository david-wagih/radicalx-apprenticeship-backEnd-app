import { Injectable } from '@nestjs/common';
import { error } from 'console';
import * as admin from 'firebase-admin';
import {
  CreateRequest,
  UpdateRequest,
} from 'firebase-admin/lib/auth/auth-config';
import {
  sendEmailVerification,
  confirmPasswordReset,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence,
  signOut,
  signInWithCustomToken,
} from 'firebase/auth';
import * as firebaseApp from 'firebase/auth';
import nodemailer from 'nodemailer';
@Injectable()
export class AuthService {
  signup(
    email: string,
    password: string,
    username: string,
    phoneNumber: string,
  ) {
    const userConfig: CreateRequest = {
      displayName: username,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      photoURL:
        'https://firebasestorage.googleapis.com/v0/b/corei14-apprenticeship-app.appspot.com/o/system%2Ficons%2FdefaultUserIcon.png?alt=media&token=1f939124-256a-4e54-bb25-fd8bf157f15e', //todo: Get photoURL from .env
      emailVerified: false,
      disabled: false,
    };
    console.log(userConfig);
    admin
      .auth()
      .createUser(userConfig)
      .then(
        (userRecord) => {
          console.log(this.checkUser());
          admin
            .auth()
            .createCustomToken(userRecord.toJSON().toString())
            .then((userToken) => {
              return userToken;
            });
        },
        (err) => {
          console.error(err);
          return err;
        },
      );
  }

  getLoginPage() {
    //todo: add login page
    console.log('This should be the registration page');
    return 'this should be the login page';
  }

  LoginUser(email: string, password: string) {
    const auth = getAuth();
    if (this.checkUser() != true) {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              if (userCredential.user.emailVerified == false) {
                const emailAddress = userCredential.user.email;
                sendEmailVerification(userCredential.user); // todo: Make sure correct tokenID is passed
                signOut(auth);
                console.log(
                  'You need to verify your email to be able to login. The activation email has been sent to ' +
                    emailAddress +
                    '. Please Check your inbox',
                );
                return (
                  'You need to verify your email to be able to login. The activation email has been sent to ' +
                  emailAddress +
                  '. Please Check your inbox'
                );
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

  getRemovePage() {
    if (this.checkUser()) {
      const auth = getAuth();
      console.log(
        'this should be the remove page for ' + auth.currentUser.displayName,
      );
      return (
        'this should be the remove page for ' + auth.currentUser.displayName
      );
    } else {
      console.log('You need to login to remove the user');
      return 'you need to login to remove the user';
    }
    // todo: add the remove page
  }

  removeUser() {
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

  async passwordResetEmail(email: string) {
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

  resetPassword(code: string, newPassword: string) {
    if (this.checkUser()) {
      console.log('You are already logged in');
      return 'You are already logged in';
    } else {
      const auth = getAuth();
      confirmPasswordReset(auth, code, newPassword).then(
        (_value) => {
          console.log('Your password has been reset successfully');
          return 'Your password has been reset successfully';
        },
        (reason) => {
          console.error(reason);
        },
      );
    }
  }

  sendResetMail(email: string) {
    admin
      .auth()
      .generatePasswordResetLink(email)
      .then((link) => {
        //console.log(link);
        this.sendMail(email, link);
      })
      .catch((error) => {
        console.error('Error sending email', error);
        return error;
      });
  }

  async sendMail(email: string, link: string) {
    const mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'CoreI14Internships@gmail.com',
        pass: 'tltreznwjzejufxc',
      },
    });

    const recipientEmail = email;
    console.log('recipientEmail: ' + recipientEmail);

    const mailOptions = {
      from: 'corei14 <CoreI14Internships@gmail.com>',
      to: recipientEmail,
      subject: 'RadicalX-Apprenticeship Password Reset',
      html: `<p style="font-size: 18px;">Reset your account password</p>
              <p style="font-size: 12px;">You requested a password reset.</p>
              <p style="font-size: 12px;">Please use the link below to reset you password:</p>
              <a href="${link}">Reset Password Link</a>
              <p style="font-size: 12px;">Best Regards,</p>
            `, // email content in HTML
    };

    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('email sent to:', recipientEmail);
      return new Promise((resolve, _reject) => {
        return resolve({
          result: 'email sent to: ' + recipientEmail,
        });
      });
    });
  }
}

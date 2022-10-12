import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UpdateRequest } from 'firebase-admin/lib/auth/auth-config';
import {
  sendEmailVerification,
  confirmPasswordReset,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence,
  signOut,
} from 'firebase/auth';
import nodemailer from 'nodemailer';
@Injectable()
export class AuthService {
  getRegistrationPage() {
    //todo: Add registration page from Front-end team
    console.log('This should be the registration page');
    return 'This should be the registration page';
  }

  registerUser(
    email: string,
    password: string,
    phoneNumber: string,
    displayName: string,
    photoURL: string,
    emailVerified: boolean,
    disabled: boolean,
  ) {
    admin
      .auth()
      .createUser({
        email: email,
        emailVerified: emailVerified,
        phoneNumber: phoneNumber,
        password: password,
        displayName: displayName,
        photoURL: photoURL,
        disabled: disabled,
      })
      .then((userRecord) => {
        return this.LoginUser(email, password);
      }) //todo: add email verification
      .catch((error) => console.error(error));
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
                sendEmailVerification(userCredential.user);
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
                admin
                  .auth()
                  .createCustomToken(user.uid)
                  .then((customToken) => {
                    //console.log(customToken);
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
    }
    console.log('You are already logged in');
    return 'You are already logged in';
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

  checkUser() {
    const user = getAuth().currentUser;
    if (user) {
      console.log('User already logged in');
      return true; //User is logged in
    } else {
      console.log('User needs to log in');
      return false; // No user is logged in.
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
              auth.currentUser.email +
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

import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AuthCredential, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, browserLocalPersistence, setPersistence } from "firebase/auth";
//import { app, firestore } from 'firebase-admin';
// import { Auth } from 'firebase-admin/lib/auth/auth';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entity';
import nodemailer from 'nodemailer';
import { app } from 'firebase-admin';



@Injectable()
export class AuthService {
  getRegistrationPage() {
    //Add registration page from Front-end team
    console.log('This should be the registration page');
    return 'This should be the registration page';
  }

  registerUser(
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

  LoginUser(email: string, password: string) {
    if(this.checkUser() != true){
      const auth = getAuth();
      setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth , email, password)
        .then((userCredential) => {         // Signed in 
          //sendEmailVerification(); //TODO: Is email verified? If not, sent verification email
          console.log("Logged in Successfully"); 
          const user = userCredential.user; // todo: save user session in browser storage to avoid logout if server restarts
        })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });  
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
    } 
          // admin.auth()
          //   .createCustomToken(user.uid)
          //   .then((customToken) => {
          //       //console.log(customToken);
          //       return customToken;          // Send token back to client
          //   })
          //   .catch((error) => {
          //     console.log('Error creating custom token:', error);
          //   });
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
    if(this.checkUser()){
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
        return 'Deleted user ' + uid + 'successfully';
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }

  sendResetMail(email: any) {
    //console.log(email);
    admin
      .auth()
      .generatePasswordResetLink(email.email)
      .then((link) => {
        //console.log(link);
        this.sendMail(email.email, link);
      })
      .catch((error) => {
        console.error('Error sending email', error);
        return error;
      });
  }

  sendMail(email: string, link: string) {
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
      return new Promise((resolve, reject) => {
        return resolve({
          result: 'email sent to: ' + recipientEmail,
        });
      });
    });
  }

  checkUser(){
    const user = getAuth().currentUser;
    if (user) {
      console.log("User already logged in");
      return true;
  
    } else {
      console.log("User needs to log in");
      return false;
    // No user is signed in.
    }
}
}

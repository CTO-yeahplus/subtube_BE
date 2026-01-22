import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CREDENTIALS_GG } from 'src/common/constant';
import { CustomLogger } from './logger.service';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;
  constructor(private logger: CustomLogger) {
    const serviceAccount = JSON.parse(JSON.stringify(CREDENTIALS_GG));
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async verifyOtp(
    phone: string,
    phoneCode: string,
    verifyCode: string,
  ): Promise<boolean> {
    const auth = this.firebaseApp.auth();
    try {
      const verificationResult = await auth.verifyIdToken(verifyCode);

      return verificationResult.phone_number === `${phoneCode}${phone}`;
    } catch (error) {
      this.logger.error(
        'Call Firebase Verify Error: ', error
      );
      this.logger.log(
        `Call Firebase Verify verifyOtp Log: ${error}`,
      );
      
      return false;
    }
  }
}

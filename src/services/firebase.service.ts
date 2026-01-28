import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CREDENTIALS_GG } from 'src/common/constant';
import { CustomLogger } from './logger.service';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;

  constructor(private logger: CustomLogger) {
    // 1. 설정 가져오기
    const serviceAccount = JSON.parse(JSON.stringify(CREDENTIALS_GG));

    // ==========================================
    // [디버깅 로그 시작] 서버 로그에서 이 부분을 꼭 확인하세요!
    // ==========================================
    console.log('======= FIREBASE CONFIG CHECK =======');
    console.log('Project ID:', serviceAccount.project_id);
    
    const pk = serviceAccount.private_key;
    if (!pk) {
      console.error('❌ ERROR: private_key is Undefined or Empty!');
      console.error('Check your .env file variable name vs src/common/enviroment.ts');
    } else {
      console.log('✅ Key Detected. Length:', pk.length);
      console.log('Key Start:', pk.substring(0, 20) + '...');
      // 줄바꿈 문자(\n)가 글자로 들어있는지 확인
      console.log('Contains literal \\n string?:', pk.includes('\\n'));
      // 진짜 줄바꿈이 들어있는지 확인
      console.log('Contains real newline?:', pk.includes('\n'));
    }
    console.log('=====================================');


    // 2. [핵심] 줄바꿈 치환 로직 (강화됨)
    // Docker .env에서 넘어온 '\n' 글자를 실제 줄바꿈으로 변경
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key
        .replace(/\\n/g, '\n')  // \n 글자를 줄바꿈으로
        .replace(/"/g, '');     // 혹시 모를 양끝 따옴표 제거
    }

    // 3. Firebase 초기화
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
      this.logger.error('Call Firebase Verify Error: ', error);
      this.logger.log(`Call Firebase Verify verifyOtp Log: ${error}`);
      return false;
    }
  }
}
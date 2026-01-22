import {
  BadRequestException,
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import * as fs from 'fs';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { genEndNameS3 } from 'src/utils';
import axios from 'axios';
import { VALIDATE_IMAGE } from 'src/common/constant';
import { I18nService } from 'nestjs-i18n';
@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  deleteFile(path: string) {
    try {
      fs.unlinkSync(path);
      return { success: 1 };
    } catch (error) {
      return { success: 0 };
    }
  }

  getFiles(folder: string) {
    return fs.readdirSync(folder, {
      withFileTypes: true,
    });
  }

  async uploadS3(file: Express.Multer.File) {
    const bucket = this.configService.get('BUCKETS3');
    const region = this.configService.get('REGIONS3');
    const genKey = genEndNameS3(file.originalname);
    const key = new Date().valueOf() + '_' + genKey;
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYAWS'),
        secretAccessKey: this.configService.get('SECRETACCESSAWS'),
      },
      region,
    });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentEncoding: 'base64',
      ContentType: file.mimetype,
      ACL: 'public-read',
    });
    try {
      await s3Client.send(command);
      return {
        url: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async uploadMultipleFilesToS3(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadPromises: any = files.map((file) => this.uploadS3(file));
    return Promise.all(uploadPromises);
  }

  async deleteS3(filename: string) {
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYAWS'),
        secretAccessKey: this.configService.get('SECRETACCESSAWS'),
      },
      region: this.configService.get('REGIONS3'),
    });
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('BUCKETS3'),
      Key: filename,
    });
    try {
      await s3Client.send(command);
      return;
    } catch (err) {
      throw new Error('Delete S3 failed');
    }
  }

  async urlToS3(imageURL) {
    const bucket = this.configService.get('BUCKETS3');
    const region = this.configService.get('REGIONS3');
    const key = imageURL.split('/').pop();
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYAWS'),
        secretAccessKey: this.configService.get('SECRETACCESSAWS'),
      },
      region: region,
    });

    try {
      const response = await axios.get(imageURL, {
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(response.data, 'binary');
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ACL: 'public-read',
          ContentType: response.headers['content-type'],
        }),
      );
      return {
        url: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async uploadImage(file) {
    if (file) {
      const parseFilePipe = new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: VALIDATE_IMAGE.IMAGE_SIZE,
            message: this.i18n.t('error.IMAGE_SIZE'),
          }),
          new FileTypeValidator({ fileType: VALIDATE_IMAGE.IMAGE_TAIL }),
        ],
      });
      try {
        await parseFilePipe.transform(file);
      } catch (error) {
        console.log(parseFilePipe);
        throw new BadRequestException(error.message);
      }

      return await this.uploadS3(file);
    }
  }
}

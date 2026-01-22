import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { genFileName } from 'src/utils';
import { ConfigService } from '@nestjs/config';

export const PATH_DOWNLOADED_FILE = `uploads`;
export const SUPPORTED_FILES = ['csv', 'xlsx'];

export const multerConfig = {
  dest: process.env.UPLOADED_FILES_DESTINATION || './',
};

export const multerOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 10 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const ext: string = file.originalname.split('.').pop() || '';
    if (SUPPORTED_FILES.indexOf(ext?.toLowerCase()) !== -1) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    /* Destination storage path details */
    destination: (req: any, file: any, cb: any) => {
      const uploadPath =
        process.env.UPLOADED_FILES_DESTINATION + '/' + PATH_DOWNLOADED_FILE;
      /* Create folder if doesn't exist */
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    /* File modification details */
    filename: (req: any, file: any, cb: any) => {
      /* Calling the callback passing the random name generated with the original extension name */
      cb(null, `${genFileName(file.originalname)}`);
    },
  }),
};

import { diskStorage } from 'multer';
import * as path from 'path';
import { genFileName } from 'src/utils';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';
import * as process from 'process';
import { existsSync, mkdirSync } from 'fs';

export const uploadFile = (): MulterOptions => {
  return {
    storage: diskStorage({
      destination: (_, __, callback) => {
        // Synchronously retrieve the environment variable
        const destinationPath = process.env.UPLOADED_FILES_DESTINATION;

        if (!destinationPath) {
          return callback(
            new Error('UPLOADED_FILES_DESTINATION is not set'),
            '',
          );
        }

        // Ensure the destination directory exists
        if (!existsSync(destinationPath)) {
          mkdirSync(destinationPath, { recursive: true });
        }

        // Call the callback with the final destination path
        callback(null, destinationPath + '/avatar/');
      },
      filename: (req, file, callback) => {
        const originName = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname);
        const filename = `${genFileName(originName)}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
      if (file.mimetype.match(/\/(jpg|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(`Unsupported file type ${file.originalname}`),
          false,
        );
      }
    },
  };
};

export const uploadFileStorage = (folderName): MulterOptions => {
  return {
    storage: diskStorage({
      destination: (_, __, callback) => {
        // Synchronously retrieve the environment variable
        const destinationPath = process.env.FOLDER_UPLOADED_DESTINATION;

        if (!destinationPath) {
          return callback(
            new Error('FOLDER_UPLOADED_DESTINATION is not set'),
            '',
          );
        }

        // Ensure the destination directory exists
        if (!existsSync(destinationPath)) {
          mkdirSync(destinationPath, { recursive: true });
        }

        if (!existsSync(destinationPath + '/' + folderName)) {
          mkdirSync(destinationPath + '/' + folderName, { recursive: true });
        }

        // Call the callback with the final destination path
        callback(null, destinationPath + '/' + folderName);
      },
      filename: (req, file, callback) => {
        const originName = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname);
        const filename = `${genFileName(originName)}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
      if (file.mimetype.match(/\/(png|jpg|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(`Unsupported file type ${file.originalname}`),
          false,
        );
      }
    },
  };
};

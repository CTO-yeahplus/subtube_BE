/* eslint-disable no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  Res,
  Param,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FileService } from '../services/file.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { genFileName, responseHelper } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { FileReqDto } from '../dtos/file.dto';
import { Response } from 'express';
import * as process from 'process';
import { existsSync, mkdirSync } from 'fs';
import { log } from "winston";

@Controller('files')
@ApiTags('File')
export class FileController {
  constructor(
    private fileService: FileService,
    private configService: ConfigService,
  ) {}

  @Get('')
  async getFiles(@Query('folder') folder: string) {
    return this.fileService.getFiles(folder);
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 6 }], {
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
          callback(null, destinationPath + '/image/');
        },
        filename: (req, file, callback) => {
          const originName = path.parse(file.originalname).name;
          const ext = path.extname(file.originalname);
          const filename = `${genFileName(originName)}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 30 * 1024 * 1024,
      },
      fileFilter(req, file, cb) {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new BadRequestException(
              `Unsupported file type ${file.originalname}`,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: FileReqDto,
  ) {
    if (files) {
      const files_arr = Object.values(files)[0] as any;
      const images = [];
      if (files && files_arr) {
        for (let i = 0; i < files_arr.length; i++) {
          const file = files_arr[i];
          const imageUrl =
            this.configService.get('APP_DOMAIN') +
            'files/image/' +
            file.filename;
          images.push(String(imageUrl));
        }
      }
      body.file = images;

      return body.file;
    } else {
      return responseHelper<any>('Error');
    }
  }

  @Get('/:direct')
  async resImage(@Res() res: Response, @Param('direct') direct: string) {
    // return res.send(fs.readFileSync('image/' + direct));
    return res.sendFile(
      path.join(
        this.configService.get('UPLOADED_FILES_DESTINATION') +
          '/avatar/' +
          direct,
      ),
    );
  }

  @Get('/uploads/:file')
  async resFile(@Res() res: Response, @Param('file') file: string) {
    return res.sendFile(
      path.join(
        this.configService.get('UPLOADED_FILES_DESTINATION') +
          '/uploads/' +
          file,
      ),
    );
  }

  @Get('/image/:file')
  async resFileImage(@Res() res: Response, @Param('file') file: string) {
    const filePath = path.join(
      this.configService.get('UPLOADED_FILES_DESTINATION'), // Use path.join to construct the absolute path
      'image',
      file,
    );

    return res.sendFile(filePath);
  }
}

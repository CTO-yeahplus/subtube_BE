import { Module } from '@nestjs/common';
import { FileService } from '../services/file.service';
import { FileController } from '../controllers/file.controller';

@Module({
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}

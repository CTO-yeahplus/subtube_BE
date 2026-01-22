import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from 'src/entities/otp.entity';
import { OptService } from '../services/otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  providers: [OptService],
  exports: [OptService],
})
export class OtpModule {}

import { BaseEntity } from 'src/entities/base.entity';
import { OTPTYPE } from 'src/common/base.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'otp' })
export class OtpEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  email: string;

  @Column({ type: 'varchar' })
  type: OTPTYPE;

  @Column({ default: false })
  is_resend: boolean;
}

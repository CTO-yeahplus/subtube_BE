import { BaseEntity } from 'src/entities/base.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {AccountType} from "../common/base.enum";
import {YoutubeAccountEntity} from "./youtube-account.entity";
import { ChangeRankEntity } from './change_rank.entity';
import { PaymentEntity } from './payment.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true})
  password: string;

  @Column({ type: 'varchar', nullable: false, default: AccountType.NORMAL })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  level: string;

  @Column({ name: 'is_verify', type: 'bool', nullable: false, default: false })
  is_verify: boolean;

  @Column({ type: 'varchar', nullable: true })
  phone_code: string; 

  @Column({ nullable: true })
  expire_verify: Date;

  @Column({ type: 'varchar', nullable: true })
  payer_id: string;

  @Column({ name: 'expire_date', nullable: true})
  expire_date: Date;

  @Column({ name: 'payment_date', nullable: true})
  payment_date: Date;

  @Column({ name: 'start_date', nullable: true})
  start_date: Date;

  @Column({ type: 'int' , default: 0})
  number_payment_err: number;
  
  @Column({
    name: 'verify_token',
    type: 'varchar',
    nullable: false,
    default: false,
  })
  verify_token: string;

  @Column({ type: 'boolean', default: true , comment: 'true send email verify and false send with phone'})
  type_verify: boolean;

  @Column({ name: 'payment_before_deadline', type: 'bool', nullable: true, default: false })
  payment_before_deadline: boolean;

  @OneToMany(() => YoutubeAccountEntity, (ya) => ya.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  youtubeAccounts: YoutubeAccountEntity[];

  @OneToMany(() => PaymentEntity, (pc) => pc.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })

  payments: PaymentEntity[];

  @OneToOne(() => ChangeRankEntity, (cr) => cr.user, {
    createForeignKeyConstraints: false,
  })
  changeRank: ChangeRankEntity;
}

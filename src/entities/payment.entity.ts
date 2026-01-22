import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'payment' })
export class PaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', nullable: true })
  payment_order_id: string;

  @Column({ type: 'varchar', nullable: true })
  rank: string;

  @Column({ type: 'varchar', nullable: true })
  payment_status: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'float', nullable: true })
  tax: number;

  @Column({ type: 'float', nullable: true })
  sub_total: number;

  @Column({ type: 'float', nullable: true })
  total: number;

  @Column({ name: 'expire_date', nullable: true})
  expire_date: Date;

  @Column({ name: 'payment_date', nullable: true})
  payment_date: Date;

  @Column({ name: 'start_date', nullable: true})
  start_date: Date;

  @Column({ type: 'varchar', nullable: true })
  payment_capture_id: string;

  @Column({ type: 'varchar', nullable: true })
  status_capture: string;

  @Column({ type: 'varchar', nullable: true })
  status_checkout_order: string;

  @Column({ type: 'json', nullable: true })
  purchase_units: string;
  
  @ManyToOne(() => UserEntity, (u) => u.payments, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

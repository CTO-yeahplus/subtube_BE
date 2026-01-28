import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'video' })
export class VideoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  youtube_account_id: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  text: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  page_token: string;

  @Column({ type: 'text', nullable: false })
  content: string;
}

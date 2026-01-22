import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'video_push' })
export class VideoPushEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  video_id: string;

  @Column({ type: 'int', nullable: false })
  youtube_account_id: number;

  @Column({ type: 'longtext', nullable: false })
  localizations: string;

  @Column({ type: 'varchar', nullable: false })
  default_lang: string;

  @Column({ type: 'varchar', nullable: false })
  category_id: string;

  @Column({ type: 'varchar', nullable: true })
  exclude_title: string;

  @Column({ type: 'varchar', nullable: true })
  exclude_description: string;
}

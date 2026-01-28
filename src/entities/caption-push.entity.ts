import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'caption_push' })
export class CaptionPushEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  video_id: string;

  @Column({ type: 'int', nullable: false })
  youtube_account_id: number;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  lang: string;

  @Column({ type: 'varchar', nullable: true })
  exclude_text: string;

  @Column({ type: 'boolean', default: false })
  is_default_lang: boolean;
}

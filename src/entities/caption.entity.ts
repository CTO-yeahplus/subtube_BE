import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'cation' })
export class CaptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  video_id: number;

  @Column({ type: 'varchar', nullable: true })
  caption_id: string;
  
  @Column({ type: 'longtext', nullable: true })
  text: string;

  @Column({ type: 'varchar', nullable: true })
  lang: string;
}

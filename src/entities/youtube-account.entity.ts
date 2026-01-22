import { BaseEntity } from 'src/entities/base.entity';
import {
  Column,
  Entity, JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import {UserEntity} from "./user.entity";

@Entity('youtube_account')
export class YoutubeAccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({type: 'int'})
  user_id: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  id_channel: string;

  @Column({ type: 'varchar', nullable: true })
  name_channel: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  custom_url: string;

  @Column({ type: 'varchar', nullable: true })
  picture: string;

  @Column({ type: 'varchar', nullable: false })
  refresh_token: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  total_video: number;

  @ManyToOne(() => UserEntity, (u) => u.youtubeAccounts, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

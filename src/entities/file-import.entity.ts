import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class FileImportEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  file_url: string;

  @Column()
  file_name: string;

  @Column()
  file_size: number;

  @Column()
  file_key: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, default: 0 })
  records: number;

  @Column({ nullable: true, default: 0 })
  total: number;

  @Column({ nullable: true })
  job_id: number;
}

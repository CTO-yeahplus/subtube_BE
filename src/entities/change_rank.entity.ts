import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { UserEntity } from './user.entity';
  import { BaseEntity } from './base.entity';
  
  @Entity({ name: 'change_rank' })
  export class ChangeRankEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'bigint' })
    user_id: number;
  
    @Column({ type: 'varchar', nullable: true })
    current_rank: string;
  
    @Column({ type: 'varchar', nullable: true })
    change_rank: string;

    @Column({ type: 'json', nullable: true })
    keep_yt_account_id?: [];
    
    @OneToOne(() => UserEntity, (u) => u.changeRank, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
  }
  
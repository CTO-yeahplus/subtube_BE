import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('token_key_admin')
@Index('admin_id_type', ['adminId', 'type'], { unique: true })
export class TokenAdminEntity {
  @PrimaryColumn({ type: 'varchar', unique: true })
  key: string;

  @Column({
    name: 'adminId',
    type: 'int',
  })
  adminId: number;

  @Column({ type: 'varchar', default: 'refresh' })
  type: string;
}

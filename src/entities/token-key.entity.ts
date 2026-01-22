import { AccountType } from 'src/common/base.enum';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('token_key')
@Index('user_id_type', ['user_id', 'type'], { unique: true })
export class TokenEntity {
  @PrimaryColumn({ type: 'varchar', unique: true, length: '500' })
  key: string;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  user_id: number;

  @Column({ type: 'varchar', default: AccountType.NORMAL })
  type: string;
}

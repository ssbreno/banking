import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Transactions } from '../../transactions/entity/transactions.entity';
import { User } from '../../user/entity/user.entity';
import { BankAccountType } from '../enum/bank-account-type.enum';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { unique: true })
  accountNumber?: string;

  @Column('varchar')
  agencyNumber?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance?: number;

  @Column({
    type: 'enum',
    enum: BankAccountType,
    nullable: true,
  })
  type?: BankAccountType;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  user?: User;

  @OneToMany(() => Transactions, (transactions) => transactions.bankAccount)
  transactions?: Transactions[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;
}

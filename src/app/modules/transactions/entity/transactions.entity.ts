import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BankAccount } from '../../bank-account/entity/bank-account.entity';
import { TransactionsType } from '../enum/transactions-type.enum';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionsType,
    nullable: true,
  })
  type: TransactionsType;

  @ManyToOne(() => BankAccount, (bankAccount) => bankAccount.transactions)
  bankAccount: BankAccount;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

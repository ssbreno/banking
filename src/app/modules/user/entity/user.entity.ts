import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BankAccount } from '../../bank-account/entity/bank-account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar')
  username: string;

  @Column('varchar')
  password: string;

  @Column('varchar', { unique: true, nullable: true })
  email: string;

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.user)
  bankAccounts?: BankAccount[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedA?: Date;
}

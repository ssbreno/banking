import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../entity/transactions.entity';
import { BankAccount } from '../../bank-account/entity/bank-account.entity';

@Injectable()
export class DeleteTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  async execute(id: string) {
    const transactions = await this.transactionsRepository.findOne({
      where: {
        id,
      },
      relations: ['bankAccount'],
    });
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        id: transactions.bankAccount.id,
      },
    });

    if (!transactions) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    await Promise.all([
      await this.transactionsRepository.delete(id),
      await this.validateAndUpdateBankAccount(bankAccount),
    ]);
    return true;
  }

  private async validateAndUpdateBankAccount(data: BankAccount) {
    const transactions = await this.transactionsRepository.find({
      where: {
        bankAccount: {
          id: data.id,
        },
      },
    });
    const totalAmount = transactions.reduce((accumulator, transaction) => {
      return accumulator + Number(transaction.amount);
    }, 0);

    const updatedBankAccount: Partial<BankAccount> = {
      ...data,
      balance: Number(totalAmount),
    };

    await this.bankAccountRepository.save(updatedBankAccount);
  }
}

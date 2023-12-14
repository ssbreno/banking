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
    });

    if (!transactions) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.transactionsRepository.delete(id);
    return true;
  }
}

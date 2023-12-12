import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../entity/transactions.entity';

@Injectable()
export class FindTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
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

    return transactions;
  }
}

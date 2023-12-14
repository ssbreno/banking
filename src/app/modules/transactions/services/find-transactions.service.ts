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
      relations: ['bankAccount'],
    });

    if (!transactions) {
      throw new HttpException('Transacao não encontrada', HttpStatus.NOT_FOUND);
    }

    return transactions;
  }
}

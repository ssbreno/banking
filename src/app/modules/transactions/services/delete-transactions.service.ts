import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../entity/transactions.entity';

@Injectable()
export class DeleteTransactionsService {
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

    await this.transactionsRepository.delete(id);
    return true;
  }
}

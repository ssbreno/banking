import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../entity/transactions.entity';
import { CreateTransactionsDTO } from '../dto/create-transactions.dto';
import { FindBankAccountService } from '../../bank-account/services/find-bank-account.service';

@Injectable()
export class CreateTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private readonly findBankAccountService: FindBankAccountService,
  ) {}

  async execute(dto: CreateTransactionsDTO) {
    const createdTransactions = this.transactionsRepository.create(
      await this.parserToDTO(dto),
    );
    await this.transactionsRepository.save(createdTransactions);
    return createdTransactions;
  }

  private async parserToDTO(dto: CreateTransactionsDTO): Promise<Transactions> {
    const transactions: Transactions = {
      amount: dto.amount,
      description: dto.description,
      type: dto.type,
      bankAccount: await this.findBankAccountService.execute(dto.bankAccountId),
    };

    return transactions;
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindBankAccountService } from '../../bank-account/services/find-bank-account.service';
import { UpdateTransactionsDTO } from '../dto/update-transactions.dto';
import { Transactions } from '../entity/transactions.entity';
import { FindTransactionsService } from './find-transactions.service';

@Injectable()
export class UpdateTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly bankAccountRepository: Repository<Transactions>,
    private readonly findTransactionsService: FindTransactionsService,
    private readonly findBankAccountService: FindBankAccountService,
  ) {}

  async execute(id: string, dto: UpdateTransactionsDTO) {
    const transactions = await this.findTransactionsService.execute(id);
    if (!transactions)
      throw new HttpException(
        `Transacao não encontrado`,
        HttpStatus.BAD_REQUEST,
      );

    const transactionsUpdated = {
      ...transactions,
      ...this.parserToDTO(dto, transactions),
    };

    return await this.bankAccountRepository.save(transactionsUpdated);
  }

  private async parserToDTO(
    dto: UpdateTransactionsDTO,
    data: Transactions,
  ): Promise<Transactions> {
    const transactions: Transactions = {
      amount: dto.amount ?? data.amount,
      description: dto.description ?? data.description,
      type: dto.type ?? data.type,
      bankAccount: await this.findBankAccountService.execute(
        dto.bankAccountId ?? data.bankAccount.id,
      ),
    };

    return transactions;
  }
}

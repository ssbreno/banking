import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTransactionsDTO } from '../dto/update-transactions.dto';
import { Transactions } from '../entity/transactions.entity';
import { FindTransactionsService } from './find-transactions.service';
import { TransactionsType } from '../enum/transactions-type.enum';
import { BankAccount } from '../../bank-account/entity/bank-account.entity';

@Injectable()
export class UpdateTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    private readonly findTransactionsService: FindTransactionsService,
  ) {}

  async execute(id: string, dto: UpdateTransactionsDTO) {
    const transactions = await this.findTransactionsService.execute(id);
    if (!transactions) {
      throw new HttpException(
        'Transacao não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedTransaction = this.parserToDTO(dto, transactions);
    await this.saveTransactionWithBankAccount(dto, updatedTransaction);
    return true;
  }

  private async saveTransactionWithBankAccount(
    dto: UpdateTransactionsDTO,
    updatedTransaction: Transactions,
  ) {
    const queryRunner =
      this.transactionsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bankAccount = await this.bankAccountRepository.findOne({
        where: {
          id: dto.bankAccountId,
        },
      });
      if (!bankAccount) {
        throw new HttpException(
          'Conta bancária não encontrada',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.validateAndUpdateBankAccount(dto, bankAccount);
      await this.transactionsRepository.save(updatedTransaction);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async validateAndUpdateBankAccount(
    dto: UpdateTransactionsDTO,
    bankAccount: BankAccount,
  ) {
    const sumTransactions =
      dto.type === TransactionsType.CREDIT ? dto.amount : -dto.amount;
    bankAccount.balance += sumTransactions;
    await this.bankAccountRepository.save(bankAccount);
  }

  private parserToDTO(
    dto: UpdateTransactionsDTO,
    data: Transactions,
  ): Transactions {
    const type =
      dto.amount > 0 ? TransactionsType.CREDIT : TransactionsType.DEBIT;

    return {
      amount: dto.amount ?? data.amount,
      description: dto.description ?? data.description,
      type,
      bankAccount: dto.bankAccountId
        ? { id: dto.bankAccountId }
        : data.bankAccount,
    };
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTransactionsDTO } from '../dto/update-transactions.dto';
import { Transactions } from '../entity/transactions.entity';
import { FindTransactionsService } from './find-transactions.service';
import { TransactionsType } from '../enum/transactions-type.enum';
import { BankAccount } from '../../bank-account/entity/bank-account.entity';
import { TransactionsUtils } from '../../../../shared/utils/transactions.utils';

@Injectable()
export class UpdateTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    private readonly findTransactionsService: FindTransactionsService,
    private readonly transactionsUtils: TransactionsUtils,
  ) {}

  async execute(id: string, dto: UpdateTransactionsDTO) {
    const transactions = await this.findTransactionsService.execute(id);
    if (!transactions) {
      throw new HttpException(
        'Transacao não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.saveTransactionWithBankAccount(dto, transactions);
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
      if (!bankAccount.isActive) {
        throw new HttpException(`Conta inativa`, HttpStatus.BAD_REQUEST);
      }
      await this.transactionsUtils.checkBankAccountBalance(dto);
      const transactionsUpdated = {
        ...updatedTransaction,
        ...this.parserToDTO(dto, updatedTransaction),
      };
      await Promise.all([
        await this.transactionsRepository.save(transactionsUpdated),
        await this.validateAndUpdateBankAccount(dto, bankAccount),
      ]);
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
    const transactions = await this.transactionsRepository.find({
      where: {
        bankAccount: {
          id: dto.bankAccountId,
        },
      },
    });
    const totalAmount = transactions.reduce((accumulator, transaction) => {
      return accumulator + Number(transaction.amount);
    }, 0);

    const updatedBankAccount: Partial<BankAccount> = {
      ...bankAccount,
      balance: Number(totalAmount),
    };

    await this.bankAccountRepository.save(updatedBankAccount);
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

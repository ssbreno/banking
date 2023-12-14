import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsUtils } from '../../../../shared/utils/transactions.utils';
import { BankAccount } from '../../bank-account/entity/bank-account.entity';
import { CreateTransactionsDTO } from '../dto/create-transactions.dto';
import { Transactions } from '../entity/transactions.entity';
import { TransactionsType } from '../enum/transactions-type.enum';

@Injectable()
export class CreateTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    private readonly transactionsUtils: TransactionsUtils,
  ) {}

  async execute(dto: CreateTransactionsDTO) {
    return await this.SaveWithTransaction(dto);
  }

  private async SaveWithTransaction(dto: CreateTransactionsDTO) {
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

      await this.transactionsUtils.checkBankAccountBalance(dto);
      if (!bankAccount.isActive) {
        throw new HttpException(`Conta inativa`, HttpStatus.BAD_REQUEST);
      }
      const type: TransactionsType =
        dto.amount > 0 ? TransactionsType.CREDIT : TransactionsType.DEBIT;

      const sumTransactions = this.transactionsUtils.calculateTransactionAmount(
        type,
        dto.amount,
      );
      const updatedBankAccount: Partial<BankAccount> = {
        ...bankAccount,
        balance: Number(bankAccount.balance) + Number(sumTransactions),
      };
      const transactionsDTO = await this.parserToDTO(dto);
      await Promise.all([
        this.transactionsRepository.save(transactionsDTO),
        this.bankAccountRepository.save(updatedBankAccount),
      ]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async parserToDTO(dto: CreateTransactionsDTO): Promise<Transactions> {
    const type: TransactionsType =
      dto.amount > 0 ? TransactionsType.CREDIT : TransactionsType.DEBIT;
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        id: dto.bankAccountId,
      },
    });

    return {
      amount: dto.amount,
      description: dto.description,
      type: type,
      bankAccount: bankAccount,
    };
  }
}

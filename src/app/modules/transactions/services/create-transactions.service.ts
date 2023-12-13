import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TransactionsUtils } from '../../../../shared/utils/transactions.utils';
import { BankAccount } from '../../bank-account/entity/bank-account.entity';
import { FindBankAccountService } from '../../bank-account/services/find-bank-account.service';
import { CreateTransactionsDTO } from '../dto/create-transactions.dto';
import { Transactions } from '../entity/transactions.entity';
import { TransactionsType } from '../enum/transactions-type.enum';

@Injectable()
export class CreateTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private readonly findBankAccountService: FindBankAccountService,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    private dataSource: DataSource,
    private readonly transactionsUtils: TransactionsUtils,
  ) {}

  async execute(dto: CreateTransactionsDTO) {
    return this.SaveWithTransaction(dto);
  }

  private async SaveWithTransaction(dto: CreateTransactionsDTO) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bankAccount = await this.bankAccountRepository.findOne({
        where: {
          id: dto.bankAccountId,
        },
      });

      await this.transactionsUtils.checkBankAccountBalance(dto);
      const sumTransactions =
        dto.type === TransactionsType.CREDIT ? dto.amount : -dto.amount;
      const updatedBankAccount: Partial<BankAccount> = {
        balance: bankAccount.balance + sumTransactions,
      };
      const transactionsDTO = await this.parserToDTO(dto);

      await Promise.all([
        this.transactionsRepository.save(transactionsDTO),
        this.bankAccountRepository.update(bankAccount.id, updatedBankAccount),
        queryRunner.commitTransaction(),
      ]);
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
    const bankAccount = await this.findBankAccountService.execute(
      dto.bankAccountId,
    );

    return {
      amount: dto.amount,
      description: dto.description,
      type: type,
      bankAccount: bankAccount,
    };
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../../app/modules/bank-account/entity/bank-account.entity';
import { CreateTransactionsDTO } from '../../app/modules/transactions/dto/create-transactions.dto';
import { TransactionsType } from '../../app/modules/transactions/enum/transactions-type.enum';

@Injectable()
export class TransactionsUtils {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  public async checkBankAccountBalance(dto: Partial<CreateTransactionsDTO>) {
    const bankAccountRepository = await this.bankAccountRepository.findOne({
      where: {
        id: dto.bankAccountId,
      },
    });

    if (!bankAccountRepository) {
      throw new HttpException(`Conta não encontrada`, HttpStatus.NOT_FOUND);
    }

    const balance = Number(bankAccountRepository.balance);

    if (balance === 0 && dto.amount < 0) {
      throw new HttpException(`Saldo insuficiente`, HttpStatus.BAD_REQUEST);
    }
  }

  public calculateTransactionAmount(
    type: TransactionsType,
    amount: number,
  ): number {
    if (type === TransactionsType.CREDIT) {
      return Number(amount);
    } else if (type === TransactionsType.DEBIT) {
      return -Math.abs(Number(amount));
    }
  }
}

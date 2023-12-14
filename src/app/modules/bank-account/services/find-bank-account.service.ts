import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../entity/bank-account.entity';
import { formatBalanceInBRL } from '../../../../shared/utils/format-currency';

@Injectable()
export class FindBankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  async execute(id: string): Promise<any> {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        id,
      },
    });

    if (!bankAccount) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    const transformBankAccount = {
      ...bankAccount,
      balance: formatBalanceInBRL(bankAccount.balance).toString(),
    };

    return transformBankAccount;
  }

  async findBankAccountByAccount(accountNumber: string) {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        accountNumber,
      },
    });

    if (!bankAccount) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    return bankAccount;
  }
}

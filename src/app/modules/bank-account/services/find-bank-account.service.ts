import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../entity/bank-account.entity';
import { CreateBankAccountDTO } from '../dto/create-bank-account.dto';

@Injectable()
export class FindBankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  async execute(id: string) {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        id,
      },
    });

    if (!bankAccount) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    return bankAccount;
  }

  async findBankAccountByAccount(
    dto: Pick<CreateBankAccountDTO, 'accountNumber'>,
  ) {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        accountNumber: dto.accountNumber,
      },
    });

    if (!bankAccount) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    return bankAccount;
  }
}

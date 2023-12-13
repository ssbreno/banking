import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBankAccountDTO } from '../dto/create-bank-account.dto';
import { BankAccount } from '../entity/bank-account.entity';
import { FindBankAccountService } from './find-bank-account.service';
import { generateRandomNumber } from '../../../../shared/utils/generate-random-number';
import { FindUsersService } from '../../user/services/find-user.service';

@Injectable()
export class CreateBankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    private readonly findBankAccountService: FindBankAccountService,
    private readonly findUsersService: FindUsersService,
  ) {}

  async execute(dto: CreateBankAccountDTO) {
    let account: Pick<BankAccount, 'accountNumber'>;
    const bankAccount =
      await this.findBankAccountService.findBankAccountByAccount(account);
    if (bankAccount)
      throw new HttpException(
        `Cliente ja possui uma conta no banco com o numero ${account?.accountNumber}`,
        HttpStatus.BAD_REQUEST,
      );

    const createdBankAccount = this.bankAccountRepository.create(
      await this.parserToDTO(dto),
    );
    await this.bankAccountRepository.save(createdBankAccount);
    return createdBankAccount;
  }

  private async parserToDTO(dto: CreateBankAccountDTO): Promise<BankAccount> {
    const bankAccount: BankAccount = {
      accountNumber: await generateRandomNumber(),
      agencyNumber: '0001',
      balance: 0,
      type: dto.type,
      user: await this.findUsersService.execute(dto.userId),
    };

    return bankAccount;
  }
}

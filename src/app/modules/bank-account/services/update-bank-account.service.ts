import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../entity/bank-account.entity';
import { FindBankAccountService } from './find-bank-account.service';
import { UpdateBankAccountDTO } from '../dto/update-bank-account.dto';

@Injectable()
export class UpdateBankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    private readonly findBankAccountService: FindBankAccountService,
  ) {}

  async execute(id: string, dto: UpdateBankAccountDTO) {
    const bankAccount = await this.findBankAccountService.execute(id);
    if (!bankAccount)
      throw new HttpException(`Cliente não encontrado`, HttpStatus.BAD_REQUEST);

    const bankAccountUpdated = {
      ...bankAccount,
      ...this.parserToDTO(dto, bankAccount),
    };

    return await this.bankAccountRepository.save(bankAccountUpdated);
  }

  private async parserToDTO(
    dto: UpdateBankAccountDTO,
    data: BankAccount,
  ): Promise<BankAccount> {
    const bankAccount: Pick<BankAccount, 'balance'> = {
      balance: dto.balance ?? data.balance,
    };

    return bankAccount;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteBankAccountDTO } from '../dto/delete-bank-account.dto';
import { BankAccount } from '../entity/bank-account.entity';

@Injectable()
export class DeleteBankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  async execute(dto: DeleteBankAccountDTO) {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!bankAccount) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.bankAccountRepository.delete(dto.id);

    return true;
  }
}

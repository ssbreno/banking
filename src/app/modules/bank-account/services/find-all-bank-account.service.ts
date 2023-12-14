import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '../../../../shared/types/pagination-type';
import { FindAllBankAccountDTO } from '../dto/find-all-bank-account.dto';
import { BankAccount } from '../entity/bank-account.entity';

@Injectable()
export class FindAllBankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  async execute(dto: FindAllBankAccountDTO): Promise<Pagination<any>> {
    const take = dto.take || 12;
    const page = dto.page || 1;
    const skip = (page - 1) * take;

    const queryBuilder = await this.mountWhere(dto);
    queryBuilder.take(take).skip(skip);
    const [result, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / take);

    return {
      data: result,
      count: total,
      totalPages,
      actualPage: dto.page,
    };
  }

  private async mountWhere(dto: FindAllBankAccountDTO) {
    const queryBuilder = this.bankAccountRepository
      .createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.user', 'user');
    const filters: { filter: string; value?: any }[] = [];

    if (dto.type) {
      filters.push({ filter: 'bankAccount.type = :type', value: dto.type });
    }

    const order = dto.asc === 'ASC' ? 'ASC' : 'DESC';
    const orderMapping = {
      type: 'bankAccount.type',
    };

    if (dto.sortBy in orderMapping) {
      queryBuilder.orderBy(orderMapping[dto.sortBy], order);
    }

    filters.forEach((filter) => {
      queryBuilder.andWhere(filter.filter, filter.value);
    });

    return queryBuilder;
  }
}

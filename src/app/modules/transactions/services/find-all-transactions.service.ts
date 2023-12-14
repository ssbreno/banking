import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '../../../../shared/types/pagination-type';
import { FindAllTransactionsDTO } from '../dto/find-all-transactions.dto';
import { Transactions } from '../entity/transactions.entity';

@Injectable()
export class FindAllTransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  async execute(dto: FindAllTransactionsDTO): Promise<Pagination<any>> {
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

  private async mountWhere(dto: FindAllTransactionsDTO) {
    const queryBuilder = this.transactionsRepository
      .createQueryBuilder('transactions')
      .leftJoinAndSelect('transactions.bankAccount', 'bankAccount');
    const filters: { filter: string; value?: any }[] = [];

    const order = dto.asc === 'ASC' ? 'ASC' : 'DESC';
    const orderMapping = {
      type: 'transactions.type',
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

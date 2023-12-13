/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllBankAccountDTO } from '../../../../../../src/app/modules/bank-account/dto/find-all-bank-account.dto';
import { BankAccount } from '../../../../../../src/app/modules/bank-account/entity/bank-account.entity';
import { FindAllBankAccountsService } from '../../../../../../src/app/modules/bank-account/services/find-all-bank-account.service';
import { BankAccountType } from '../../../../../../src/app/modules/bank-account/enum/bank-account-type.enum';

describe('FindAllBankAccountsService', () => {
  let findAllBankAccountsService: FindAllBankAccountsService;
  let bankAccountRepository: Repository<BankAccount>;

  const mockBankAccountRepository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllBankAccountsService,
        {
          provide: getRepositoryToken(BankAccount),
          useValue: mockBankAccountRepository,
        },
      ],
    }).compile();

    findAllBankAccountsService = module.get<FindAllBankAccountsService>(
      FindAllBankAccountsService,
    );
    bankAccountRepository = module.get<Repository<BankAccount>>(
      getRepositoryToken(BankAccount),
    );
  });

  it('should be defined', () => {
    expect(findAllBankAccountsService).toBeDefined();
  });

  describe('execute', () => {
    it('should execute query with default pagination parameters', async () => {
      const findAllBankAccountDTO: FindAllBankAccountDTO = {};
      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      };
      mockBankAccountRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await findAllBankAccountsService.execute(
        findAllBankAccountDTO,
      );

      expect(result).toEqual({
        data: [],
        count: 0,
        totalPages: 0,
        actualPage: 1,
      });
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(12);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should execute query with custom pagination parameters', async () => {
      const findAllBankAccountDTO: FindAllBankAccountDTO = {
        take: 20,
        page: 2,
      };

      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      };
      mockBankAccountRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await findAllBankAccountsService.execute(
        findAllBankAccountDTO,
      );

      expect(result).toEqual({
        data: [],
        count: 0,
        totalPages: 0,
        actualPage: 2,
      });
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should execute query with sorting and filtering', async () => {
      const findAllBankAccountDTO: FindAllBankAccountDTO = {
        take: 10,
        page: 1,
        type: BankAccountType.BANK_ACCOUNT,
        sortBy: 'type',
        asc: 'ASC',
      };

      // Mock the query builder
      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      };
      mockBankAccountRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await findAllBankAccountsService.execute(
        findAllBankAccountDTO,
      );

      expect(result).toEqual({
        data: [],
        count: 0,
        totalPages: 0,
        actualPage: 1,
      });
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'bankAccount.type',
        'ASC',
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'bankAccount.type = :type',
        {
          type: findAllBankAccountDTO.type,
        },
      );
    });
  });
});

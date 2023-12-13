/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../../../../../../src/app/modules/bank-account/entity/bank-account.entity';
import { FindBankAccountService } from '../../../../../../src/app/modules/bank-account/services/find-bank-account.service';
import { BankAccountType } from '../../../../../../src/app/modules/bank-account/enum/bank-account-type.enum';
import { UserMock } from '../../../../../test-utils/mocks/user';

describe('FindBankAccountService', () => {
  let findBankAccountService: FindBankAccountService;
  let bankAccountRepository: Repository<BankAccount>;

  const mockBankAccountRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindBankAccountService,
        {
          provide: getRepositoryToken(BankAccount),
          useValue: mockBankAccountRepository,
        },
      ],
    }).compile();

    findBankAccountService = module.get<FindBankAccountService>(
      FindBankAccountService,
    );
    bankAccountRepository = module.get<Repository<BankAccount>>(
      getRepositoryToken(BankAccount),
    );
  });

  it('should be defined', () => {
    expect(findBankAccountService).toBeDefined();
  });

  describe('execute', () => {
    it('should find a bank account by ID', async () => {
      const bankAccountId = '123';

      const bankAccount: BankAccount = {
        id: bankAccountId,
        accountNumber: '789',
        agencyNumber: '0001',
        balance: 0,
        type: BankAccountType.BANK_ACCOUNT,
        user: UserMock(),
      };
      mockBankAccountRepository.findOne.mockResolvedValue(bankAccount);

      const result = await findBankAccountService.execute(bankAccountId);

      expect(result).toEqual(bankAccount);
      expect(mockBankAccountRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: bankAccountId,
        },
      });
    });

    it('should throw an exception if the bank account is not found', async () => {
      const bankAccountId = '789';
      mockBankAccountRepository.findOne.mockResolvedValue(undefined);

      await expect(
        findBankAccountService.execute(bankAccountId),
      ).rejects.toThrowError(HttpException);
      expect(mockBankAccountRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: bankAccountId,
        },
      });
    });
  });

  describe('findBankAccountByAccount', () => {
    it('should find a bank account by account number', async () => {
      const accountNumber = '789';

      const bankAccount: BankAccount = {
        id: '123',
        accountNumber: accountNumber,
        agencyNumber: '0001',
        balance: 0,
        type: BankAccountType.BANK_ACCOUNT,
        user: UserMock(),
      };

      mockBankAccountRepository.findOne.mockResolvedValue(bankAccount);
      const result = await findBankAccountService.findBankAccountByAccount({
        accountNumber,
      });

      expect(result).toEqual(bankAccount);
      expect(mockBankAccountRepository.findOne).toHaveBeenCalledWith({
        where: {
          accountNumber: accountNumber,
        },
      });
    });

    it('should throw an exception if the bank account is not found', async () => {
      const accountNumber = '789';
      mockBankAccountRepository.findOne.mockResolvedValue(undefined);
      await expect(
        findBankAccountService.findBankAccountByAccount({ accountNumber }),
      ).rejects.toThrowError(HttpException);
      expect(mockBankAccountRepository.findOne).toHaveBeenCalledWith({
        where: {
          accountNumber: accountNumber,
        },
      });
    });
  });
});

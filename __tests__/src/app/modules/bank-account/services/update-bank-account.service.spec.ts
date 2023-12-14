/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBankAccountDTO } from '../../../../../../src/app/modules/bank-account/dto/update-bank-account.dto';
import { BankAccount } from '../../../../../../src/app/modules/bank-account/entity/bank-account.entity';
import { FindBankAccountService } from '../../../../../../src/app/modules/bank-account/services/find-bank-account.service';
import { UpdateBankAccountsService } from '../../../../../../src/app/modules/bank-account/services/update-bank-account.service';
import { UserMock } from '../../../../../test-utils/mocks/user';
import { BankAccountType } from '../../../../../../src/app/modules/bank-account/enum/bank-account-type.enum';

describe('UpdateBankAccountsService', () => {
  let updateBankAccountsService: UpdateBankAccountsService;
  let bankAccountRepository: Repository<BankAccount>;
  let findBankAccountService: FindBankAccountService;

  const mockBankAccountRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockFindBankAccountService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBankAccountsService,
        FindBankAccountService,
        {
          provide: getRepositoryToken(BankAccount),
          useValue: mockBankAccountRepository,
        },
        {
          provide: FindBankAccountService,
          useValue: mockFindBankAccountService,
        },
      ],
    }).compile();

    updateBankAccountsService = module.get<UpdateBankAccountsService>(
      UpdateBankAccountsService,
    );
    bankAccountRepository = module.get<Repository<BankAccount>>(
      getRepositoryToken(BankAccount),
    );
    findBankAccountService = module.get<FindBankAccountService>(
      FindBankAccountService,
    );
  });

  it('should be defined', () => {
    expect(updateBankAccountsService).toBeDefined();
  });

  describe('execute', () => {
    it('should update a bank account', async () => {
      const bankAccountId = '123';
      const updateBankAccountDTO: UpdateBankAccountDTO = {
        balance: 1000,
      };

      const bankAccount: BankAccount = {
        id: bankAccountId,
        accountNumber: '789',
        agencyNumber: '0001',
        balance: 500,
        type: BankAccountType.BANK_ACCOUNT,
        user: UserMock(),
      };
      mockFindBankAccountService.execute.mockResolvedValue(bankAccount);
      mockBankAccountRepository.save.mockResolvedValue(bankAccount);

      const result = await updateBankAccountsService.execute(
        bankAccountId,
        updateBankAccountDTO,
      );

      expect(result).toEqual(bankAccount);
      expect(mockFindBankAccountService.execute).toHaveBeenCalledWith(
        bankAccountId,
      );
      expect(mockBankAccountRepository.save).toHaveBeenCalledWith({
        ...bankAccount,
        balance: 1000,
      });
    });

    it('should throw an exception if the bank account is not found', async () => {
      const bankAccountId = '123';
      const updateBankAccountDTO: UpdateBankAccountDTO = {
        balance: 1000,
      };
      mockFindBankAccountService.execute.mockResolvedValue(null);

      await expect(
        updateBankAccountsService.execute(bankAccountId, updateBankAccountDTO),
      ).rejects.toThrowError(HttpException);
      expect(mockFindBankAccountService.execute).toHaveBeenCalledWith(
        bankAccountId,
      );
      expect(mockBankAccountRepository.save).not.toHaveBeenCalled();
    });
  });
});

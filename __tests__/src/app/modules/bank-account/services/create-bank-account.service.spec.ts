/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBankAccountDTO } from '../../../../../../src/app/modules/bank-account/dto/create-bank-account.dto';
import { BankAccount } from '../../../../../../src/app/modules/bank-account/entity/bank-account.entity';
import { CreateBankAccountsService } from '../../../../../../src/app/modules/bank-account/services/create-bank-account.service';
import { FindBankAccountService } from '../../../../../../src/app/modules/bank-account/services/find-bank-account.service';
import { FindUsersService } from '../../../../../../src/app/modules/user/services/find-user.service';
import { BankAccountMock } from '../../../../../test-utils/mocks/bank-account';
import { UserMock } from '../../../../../test-utils/mocks/user';

describe('CreateBankAccountsService', () => {
  let createBankAccountsService: CreateBankAccountsService;
  let bankAccountRepository: Repository<BankAccount>;
  let findBankAccountService: FindBankAccountService;
  let findUsersService: FindUsersService;

  const mockBankAccountRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockFindBankAccountService = {
    findBankAccountByAccount: jest.fn(),
  };

  const mockFindUsersService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBankAccountsService,
        {
          provide: getRepositoryToken(BankAccount),
          useValue: mockBankAccountRepository,
        },
        {
          provide: FindBankAccountService,
          useValue: mockFindBankAccountService,
        },
        {
          provide: FindUsersService,
          useValue: mockFindUsersService,
        },
      ],
    }).compile();

    createBankAccountsService = module.get<CreateBankAccountsService>(
      CreateBankAccountsService,
    );
    bankAccountRepository = module.get<Repository<BankAccount>>(
      getRepositoryToken(BankAccount),
    );
    findBankAccountService = module.get<FindBankAccountService>(
      FindBankAccountService,
    );
    findUsersService = module.get<FindUsersService>(FindUsersService);
  });

  it('should be defined', () => {
    expect(createBankAccountsService).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new bank account', async () => {
      const createBankAccountDTO: CreateBankAccountDTO = BankAccountMock();
      const bankAccount: BankAccount = BankAccountMock();

      mockFindBankAccountService.findBankAccountByAccount.mockResolvedValue(
        undefined,
      );
      mockBankAccountRepository.create.mockReturnValue(bankAccount);
      mockBankAccountRepository.save.mockResolvedValue(bankAccount);
      mockFindUsersService.execute.mockResolvedValue(bankAccount.user);

      const createdBankAccount =
        await createBankAccountsService.execute(createBankAccountDTO);

      expect(createdBankAccount).toEqual(bankAccount);
      expect(mockBankAccountRepository.create).toHaveBeenCalledWith(
        bankAccount,
      );
      expect(mockBankAccountRepository.save).toHaveBeenCalledWith(bankAccount);
    });

    it('should throw an exception if the bank account already exists', async () => {
      const createBankAccountDTO: CreateBankAccountDTO = BankAccountMock();
      mockFindBankAccountService.findBankAccountByAccount.mockResolvedValue({
        accountNumber: '789',
        agencyNumber: '0001',
        balance: 0,
        type: createBankAccountDTO.type,
        user: UserMock(),
      });

      await expect(
        createBankAccountsService.execute(createBankAccountDTO),
      ).rejects.toThrowError(HttpException);
      expect(mockBankAccountRepository.create).not.toHaveBeenCalled();
      expect(mockBankAccountRepository.save).not.toHaveBeenCalled();
    });
  });
});

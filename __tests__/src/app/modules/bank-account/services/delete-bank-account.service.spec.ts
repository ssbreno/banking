/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteBankAccountDTO } from '../../../../../../src/app/modules/bank-account/dto/delete-bank-account.dto';
import { BankAccount } from '../../../../../../src/app/modules/bank-account/entity/bank-account.entity';
import { DeleteBankAccountService } from '../../../../../../src/app/modules/bank-account/services/delete-bank-account.service';
import { UserMock } from '../../../../../test-utils/mocks/user';
import { BankAccountType } from '../../../../../../src/app/modules/bank-account/enum/bank-account-type.enum';

describe('DeleteBankAccountService', () => {
  let deleteBankAccountService: DeleteBankAccountService;
  let bankAccountRepository: Repository<BankAccount>;

  const mockBankAccountRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBankAccountService,
        {
          provide: getRepositoryToken(BankAccount),
          useValue: mockBankAccountRepository,
        },
      ],
    }).compile();

    deleteBankAccountService = module.get<DeleteBankAccountService>(
      DeleteBankAccountService,
    );
    bankAccountRepository = module.get<Repository<BankAccount>>(
      getRepositoryToken(BankAccount),
    );
  });

  it('should be defined', () => {
    expect(deleteBankAccountService).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a bank account by ID', async () => {
      const deleteBankAccountDTO: DeleteBankAccountDTO = {
        id: '123',
      };
      const bankAccount: BankAccount = {
        id: '123',
        accountNumber: '789',
        agencyNumber: '0001',
        balance: 0,
        type: BankAccountType.BANK_ACCOUNT,
        user: UserMock(),
      };
      mockBankAccountRepository.findOne.mockResolvedValue(bankAccount);

      const result =
        await deleteBankAccountService.execute(deleteBankAccountDTO);

      expect(result).toBe(true);
      expect(mockBankAccountRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: deleteBankAccountDTO.id,
        },
      });
      expect(mockBankAccountRepository.delete).toHaveBeenCalledWith(
        deleteBankAccountDTO.id,
      );
    });

    it('should throw an exception if the bank account is not found', async () => {
      const deleteBankAccountDTO: DeleteBankAccountDTO = {
        id: '789',
      };
      mockBankAccountRepository.findOne.mockResolvedValue(undefined);
      await expect(
        deleteBankAccountService.execute(deleteBankAccountDTO),
      ).rejects.toThrowError(HttpException);
      expect(mockBankAccountRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: deleteBankAccountDTO.id,
        },
      });
      expect(mockBankAccountRepository.delete).toHaveBeenCalled();
    });
  });
});

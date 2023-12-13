/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../../../src/app/modules/user/entity/user.entity';
import { FindUsersService } from '../../../../../../src/app/modules/user/services/find-user.service';

describe('FindUsersService', () => {
  let findUsersService: FindUsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    findUsersService = module.get<FindUsersService>(FindUsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(findUsersService).toBeDefined();
  });

  describe('execute', () => {
    it('should find a user by ID', async () => {
      const userId = '123';
      const user = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await findUsersService.execute(userId);
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
      });
    });

    it('should throw an exception if the user is not found', async () => {
      const userId = '456';
      mockUserRepository.findOne.mockResolvedValue(undefined);
      await expect(findUsersService.execute(userId)).rejects.toThrowError(
        HttpException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
      });
    });
  });
});

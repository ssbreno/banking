import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../../../../../../src/app/modules/user/dto/create-user.dto';
import { User } from '../../../../../../src/app/modules/user/entity/user.entity';
import { CreateUserService } from '../../../../../../src/app/modules/user/services/create-user.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let userRepository: Repository<User>;
  const mockUserRepository = {
    create: jest.fn().mockResolvedValue(new User()),
    save: jest.fn().mockResolvedValue(new User()),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(new User()),
    })),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    createUserService = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(createUserService).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new user', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      mockUserRepository
        .createQueryBuilder()
        .getOne.mockResolvedValue(undefined);

      userRepository.save = jest.fn().mockReturnValue(createUserDTO);
      const createdUser = await createUserService.execute(createUserDTO);

      expect(createdUser).toBeDefined();
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if the user already exists', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      mockUserRepository
        .createQueryBuilder()
        .getOne.mockResolvedValue(createUserDTO);

      await expect(
        createUserService.execute(createUserDTO),
      ).rejects.toThrowError(HttpException);
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateRandomPassword } from '../../../../shared/utils/generate-random-password';
import { User } from '../entity/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async execute(dto: CreateUserDTO) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (user)
      throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);

    const createdUser = this.userRepository.create(await this.parserToDTO(dto));
    await this.userRepository.save(createdUser);
    return createdUser;
  }

  private async parserToDTO(dto: CreateUserDTO): Promise<User> {
    const user: User = {
      username: dto.username,
      email: dto.email,
      password: await generateRandomPassword(dto.password),
    };

    return user;
  }
}

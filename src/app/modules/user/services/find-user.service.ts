import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class FindUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}

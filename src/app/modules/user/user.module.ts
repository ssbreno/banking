import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { User } from './entity/user.entity';
import { CreateUserService } from './services/create-user.service';
import { FindUsersService } from './services/find-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [CreateUserService, FindUsersService],
  exports: [CreateUserService, FindUsersService],
})
export class UsersModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountController } from './controllers/bank-account.controller';
import { BankAccount } from './entity/bank-account.entity';
import { CreateBankAccountsService } from './services/create-bank-account.service';
import { FindBankAccountService } from './services/find-bank-account.service';
import { UsersModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { DeleteBankAccountService } from './services/delete-bank-account.service';
import { FindAllBankAccountsService } from './services/find-all-bank-account.service';
import { UpdateBankAccountsService } from './services/update-bank-account.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([BankAccount, User]),
  ],
  controllers: [BankAccountController],
  providers: [
    CreateBankAccountsService,
    FindBankAccountService,
    DeleteBankAccountService,
    UpdateBankAccountsService,
    FindAllBankAccountsService,
  ],
  exports: [CreateBankAccountsService, FindBankAccountService],
})
export class BankAccountModule {}

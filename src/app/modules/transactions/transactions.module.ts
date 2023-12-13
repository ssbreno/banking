import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entity/transactions.entity';
import { Module, forwardRef } from '@nestjs/common';
import { BankAccount } from '../bank-account/entity/bank-account.entity';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { TransactionsController } from './controllers/transactions.controller';
import { CreateTransactionsService } from './services/create-transactions.service';
import { DeleteTransactionsService } from './services/delete-transactions.service';
import { FindAllTransactionsService } from './services/find-all-transactions.service';
import { FindTransactionsService } from './services/find-transactions.service';
import { UpdateTransactionsService } from './services/update-transactions.service';
import { TransactionsUtils } from '../../../shared/utils/transactions.utils';

@Module({
  imports: [
    forwardRef(() => BankAccountModule),
    TypeOrmModule.forFeature([Transactions, BankAccount]),
  ],
  controllers: [TransactionsController],
  providers: [
    CreateTransactionsService,
    DeleteTransactionsService,
    FindAllTransactionsService,
    FindTransactionsService,
    UpdateTransactionsService,
    TransactionsUtils,
  ],
  exports: [
    CreateTransactionsService,
    DeleteTransactionsService,
    FindAllTransactionsService,
    FindTransactionsService,
    UpdateTransactionsService,
  ],
})
export class TransactionstModule {}

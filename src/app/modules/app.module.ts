import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from '../../core/interceptors/errors.interceptor';
import { UsersModule } from './user/user.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { TransactionstModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      useUTC: true,
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    HealthcheckModule,
    UsersModule,
    BankAccountModule,
    TransactionstModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}

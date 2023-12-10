import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { HealthcheckModule } from './application/modules/healthcheck/healthcheck.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { HealthcheckService } from './services/healthcheck.service';
import { HealthcheckController } from './controllers/healthcheck.controller';

@Module({
  controllers: [HealthcheckController],
  providers: [HealthcheckService],
})
export class HealthcheckModule {}

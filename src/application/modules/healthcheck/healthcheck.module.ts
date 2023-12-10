import { Module } from '@nestjs/common';
import { HealthcheckService } from '../../business/healthcheck/healthcheck.service';
import { HealthcheckController } from '../../controllers/healthcheck/healthcheck.controller';

@Module({
  controllers: [HealthcheckController],
  providers: [HealthcheckService],
})
export class HealthcheckModule {}

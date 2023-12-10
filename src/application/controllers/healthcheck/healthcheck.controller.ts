import { ApiTags } from '@nestjs/swagger';
import { HealthcheckService } from '../../business/healthcheck/healthcheck.service';
import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
@ApiTags('Healthcheck')
export class HealthcheckController {
  constructor(private readonly healthCheckService: HealthcheckService) {}

  @Get()
  async helloWorld(): Promise<string> {
    return this.healthCheckService.helloWorld();
  }
}

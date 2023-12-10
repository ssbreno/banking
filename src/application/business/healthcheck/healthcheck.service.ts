import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  public async helloWorld() {
    return `VERSION=0.0.1`;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateBankAccountDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Saldo', nullable: true })
  balance?: number;
}

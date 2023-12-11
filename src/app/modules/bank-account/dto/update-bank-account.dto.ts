import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBankAccountDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Saldo', nullable: true })
  balance?: number;
}

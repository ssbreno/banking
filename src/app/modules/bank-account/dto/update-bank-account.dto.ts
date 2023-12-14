import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBankAccountDTO {
  @IsBoolean()
  @ApiProperty({ description: 'Ativo ou inativo', nullable: true })
  @IsOptional()
  isActive?: boolean;
}

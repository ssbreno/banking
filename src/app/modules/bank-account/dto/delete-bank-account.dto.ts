import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteBankAccountDTO {
  @IsUUID()
  @ApiProperty()
  id: string;
}

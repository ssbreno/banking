import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BankAccountType } from '../enum/bank-account-type.enum';

export class CreateBankAccountDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id do usuario', nullable: true })
  userId?: string;

  @IsOptional()
  @IsEnum(BankAccountType)
  @ApiProperty({
    description: 'Tipo da conta',
    nullable: true,
    enum: BankAccountType,
    type: () => BankAccountType,
    isArray: true,
  })
  type?: BankAccountType;
}

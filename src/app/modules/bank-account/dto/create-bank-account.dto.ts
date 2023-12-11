import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { BankAccountType } from '../enum/bank-account-type.enum';

export class CreateBankAccountDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Numero da conta', nullable: true })
  accountNumber?: string;

  @IsString()
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

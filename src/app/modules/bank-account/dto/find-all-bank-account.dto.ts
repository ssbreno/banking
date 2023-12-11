import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BankAccountType } from '../enum/bank-account-type.enum';

export class FindAllBankAccountDTO {
  @IsOptional()
  @IsEnum(BankAccountType)
  @ApiProperty({
    description: 'Tipo da conta',
    enum: BankAccountType,
  })
  type?: BankAccountType;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sortBy?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty()
  take?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty()
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  asc?: string;
}

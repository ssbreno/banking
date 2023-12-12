import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { TransactionsType } from '../enum/transactions-type.enum';

export class UpdateTransactionsDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Valor da transação', nullable: true })
  amount?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Description', nullable: true })
  description?: string;

  @IsOptional()
  @IsEnum(TransactionsType)
  @ApiProperty({
    description: 'Tipo da transação',
    nullable: true,
    enum: TransactionsType,
    type: () => TransactionsType,
    isArray: true,
  })
  type?: TransactionsType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id da conta bancaria', nullable: true })
  bankAccountId?: string;
}

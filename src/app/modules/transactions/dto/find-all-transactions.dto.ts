import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionsType } from '../enum/transactions-type.enum';

export class FindAllTransactionsDTO {
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
  @IsOptional()
  @ApiProperty({ description: 'Id da conta bancaria', nullable: true })
  bankAccountId?: string;

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

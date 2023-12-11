import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nome do cliente', nullable: true })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Senha', nullable: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'E-mail', nullable: true })
  email: string;
}

import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateBankAccountDTO } from '../dto/create-bank-account.dto';
import { CreateBankAccountsService } from '../services/create-bank-account.service';
import { FindBankAccountService } from '../services/find-bank-account.service';
import { DeleteBankAccountService } from '../services/delete-bank-account.service';
import { DeleteBankAccountDTO } from '../dto/delete-bank-account.dto';
import { UpdateBankAccountDTO } from '../dto/update-bank-account.dto';
import { UpdateBankAccountsService } from '../services/update-bank-account.service';
import { FindAllBankAccountDTO } from '../dto/find-all-bank-account.dto';
import { FindAllBankAccountsService } from '../services/find-all-bank-account.service';

@Controller('bank-account')
@ApiTags('Bank Account')
export class BankAccountController {
  constructor(
    private readonly createBankAccountsService: CreateBankAccountsService,
    private readonly findBankAccountService: FindBankAccountService,
    private readonly deleteBankAccountService: DeleteBankAccountService,
    private readonly updateBankAccountService: UpdateBankAccountsService,
    private readonly findAllBankAccountsService: FindAllBankAccountsService,
  ) {}

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'Bank Account found',
  })
  @ApiResponse({ status: 404, description: 'Bank Account not found' })
  async createBankAccount(@Body() body: CreateBankAccountDTO) {
    return await this.createBankAccountsService.execute(body);
  }

  @Put(':id')
  @ApiBody({ type: UpdateBankAccountDTO })
  @ApiOperation({ summary: 'Update Bank Account' })
  @ApiResponse({ status: 200, description: 'Bank Account updated' })
  @ApiResponse({ status: 404, description: 'Bank Account not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateBankAccount(
    @Param('id') id: string,
    @Body() dto: UpdateBankAccountDTO,
  ): Promise<any> {
    return await this.updateBankAccountService.execute(id, dto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank Account found',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank Account not found',
  })
  async getBankAccount(@Param() id: string) {
    return await this.findBankAccountService.execute(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Bank Accounts found',
  })
  @ApiResponse({ status: 404, description: 'Bank Accounts not found' })
  async getAllBankAccount(@Query() dto: FindAllBankAccountDTO) {
    return await this.findAllBankAccountsService.execute(dto);
  }

  @Delete(':id')
  @ApiBody({ type: DeleteBankAccountDTO })
  @ApiResponse({
    status: 201,
    description: 'Bank Account deleted',
    type: DeleteBankAccountDTO,
  })
  async deleteOne(@Param() dto: DeleteBankAccountDTO) {
    return await this.deleteBankAccountService.execute(dto);
  }
}

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
import { CreateTransactionsDTO } from '../dto/create-transactions.dto';
import { FindAllTransactionsDTO } from '../dto/find-all-transactions.dto';
import { UpdateTransactionsDTO } from '../dto/update-transactions.dto';
import { CreateTransactionsService } from '../services/create-transactions.service';
import { DeleteTransactionsService } from '../services/delete-transactions.service';
import { FindAllTransactionsService } from '../services/find-all-transactions.service';
import { FindTransactionsService } from '../services/find-transactions.service';
import { UpdateTransactionsService } from '../services/update-transactions.service';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionsService: CreateTransactionsService,
    private readonly findTransactionsService: FindTransactionsService,
    private readonly deleteTransactionsService: DeleteTransactionsService,
    private readonly updateTransactionsService: UpdateTransactionsService,
    private readonly findAllTransactionsService: FindAllTransactionsService,
  ) {}

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async createBankAccount(@Body() body: CreateTransactionsDTO) {
    return await this.createTransactionsService.execute(body);
  }

  @Put(':id')
  @ApiBody({ type: UpdateTransactionsDTO })
  @ApiOperation({ summary: 'Update Transaction' })
  @ApiResponse({ status: 200, description: 'Transaction updated' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateBankAccount(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionsDTO,
  ): Promise<any> {
    return await this.updateTransactionsService.execute(id, dto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async getBankAccount(@Param() id: string) {
    return await this.findTransactionsService.execute(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Transactions found',
  })
  @ApiResponse({ status: 404, description: 'Transactions not found' })
  async getAllBankAccount(@Query() dto: FindAllTransactionsDTO) {
    return await this.findAllTransactionsService.execute(dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'Transaction deleted',
  })
  async deleteOne(@Param() id: string) {
    return await this.deleteTransactionsService.execute(id);
  }
}

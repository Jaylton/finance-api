import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FindAllTransfersDto } from './dto/find-all-transfer.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt.guard';
import { CreateTransferUseCase } from 'src/domain/transfer/services/create-transfer.usercase';
import { GetAllTransfersUseCase } from 'src/domain/transfer/services/get-all-transfers.usercase';
import { GetGraphicDataUseCase } from 'src/domain/transfer/services/get-graphic-data.usercase';
import { DeleteTransferUseCase } from 'src/domain/transfer/services/delete-transfer.usercase';
import { ImportCSVUseCase } from 'src/domain/transfer/services/import-csv.usercase';
import { UpdateTransferUseCase } from 'src/domain/transfer/services/update-transfer.usercase';

@Controller('transfers')
export class TransferController {
    constructor(
        private readonly createTranfer: CreateTransferUseCase,
        private readonly getAllTransfers: GetAllTransfersUseCase,
        private readonly getGraphicData: GetGraphicDataUseCase,
        private readonly deleteTransfer: DeleteTransferUseCase,
        private readonly importCsv: ImportCSVUseCase,
        private readonly updateTransfer: UpdateTransferUseCase,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() query: FindAllTransfersDto) {
        return this.getAllTransfers.execute(query);
    }

    @Get('graphic')
    @UseGuards(JwtAuthGuard)
    graphic(@Query() query: FindAllTransfersDto) {
        return this.getGraphicData.execute(query);
    }

    @Post('import-csv')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    importCsvData(
        @UploadedFile() file: Express.Multer.File,
        @Body('accountId') accountId?: string,
        @Body('cardId') cardId?: string
    ) {
        return this.importCsv.execute(file.buffer, accountId, cardId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createTransferDto: CreateTransferDto) {
        return this.createTranfer.execute(createTransferDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Body() updateTransferDto: Partial<CreateTransferDto>, @Param('id') id: string) {
        return this.updateTransfer.execute(id, updateTransferDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return await this.deleteTransfer.execute(id);
    }

}

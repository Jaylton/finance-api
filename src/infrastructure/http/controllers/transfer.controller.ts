import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
// import { FindAllTransfersDto } from './dto/find-all-transfer.dto';
// import { CreateTransferDto } from './dto/create-transfer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt.guard';
import { CreateTransferUseCase } from 'src/domain/transfer/services/create-transfer.usercase';
import { GetAllTransfersUseCase } from 'src/domain/transfer/services/get-all-transfers.usercase';
import { GetGraphicDataUseCase } from 'src/domain/transfer/services/get-graphic-data.usercase';
import { DeleteTransferUseCase } from 'src/domain/transfer/services/delete-transfer.usercase';

@Controller('transfers')
export class TransferController {
    constructor(
        private readonly createTranfer: CreateTransferUseCase,
        private readonly getAllTransfers: GetAllTransfersUseCase,
        private readonly getGraphicData: GetGraphicDataUseCase,
        private readonly deleteTransfer: DeleteTransferUseCase
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() query: any) {
        return this.getAllTransfers.execute(query);
    }

    @Get('graphic')
    @UseGuards(JwtAuthGuard)
    graphic(@Query() query: any) {
        return this.getGraphicData.execute(query);
    }

    // @Post('import-csv')
    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(FileInterceptor('file'))
    // importCsv(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body('accountId') accountId?: number,
    //     @Body('cardId') cardId?: number
    // ) {
    //     return this.transfersService.importCsv(file.buffer, accountId, cardId);
    // }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createTransferDto: any) {
        return this.createTranfer.execute(createTransferDto);
    }

    // @Patch(':id')
    // @UseGuards(JwtAuthGuard)
    // update(@Body() updateTransferDto: Partial<CreateTransferDto>, @Param('id') id: number) {
    //     return this.transfersService.update(id, updateTransferDto);
    // }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return await this.deleteTransfer.execute(id);
    }

}

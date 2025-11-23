import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { FindAllTransfersDto } from './dto/find-all-transfer.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('transfers')
export class TransfersController {
    constructor(private readonly transfersService: TransfersService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() query: FindAllTransfersDto) {
        return this.transfersService.findAll(query);
    }

    @Get('graphic')
    @UseGuards(JwtAuthGuard)
    graphic(@Query() query: FindAllTransfersDto) {
        return this.transfersService.graphic(query);
    }

    @Post('import-csv')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    importCsv(
        @UploadedFile() file: Express.Multer.File,
        @Body('accountId') accountId?: number,
        @Body('cardId') cardId?: number
    ) {
        return this.transfersService.importCsv(file.buffer, accountId, cardId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createTransferDto: CreateTransferDto) {
        return this.transfersService.create(createTransferDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Body() updateTransferDto: Partial<CreateTransferDto>, @Param('id') id: number) {
        return this.transfersService.update(id, updateTransferDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: number) {
        return await this.transfersService.remove(id);
    }

}

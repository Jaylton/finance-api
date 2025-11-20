import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { FindAllTransfersDto } from './dto/find-all-transfer.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfers')
export class TransfersController {
    constructor(private readonly transfersService: TransfersService) {}

    @Get()
    findAll(@Query() query: FindAllTransfersDto) {
        return this.transfersService.findAll(query);
    }
    
    @Get('graphic')
    graphic(@Query() query: FindAllTransfersDto) {
        return this.transfersService.graphic(query);
    }

    @Post()
    create(@Body() createTransferDto: CreateTransferDto) {
        return this.transfersService.create(createTransferDto);
    }

    @Patch(':id')
    update(@Body() updateTransferDto: Partial<CreateTransferDto>, @Param('id') id: number) {
        return this.transfersService.update(id, updateTransferDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.transfersService.remove(id);
    }

}

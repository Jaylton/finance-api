import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.remove(id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateCardUseCase } from "src/domain/card/services/create-card.usercase";
import { DeleteCardUseCase } from "src/domain/card/services/delete-card.usercase";
import { GetAllCardsUseCase } from "src/domain/card/services/get-all-cards.usercase";
import { GetCardUseCase } from "src/domain/card/services/get-card.usercase";
import { UpdateCardUseCase } from "src/domain/card/services/update-card.usercase";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt.guard";

class CreateCardDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

class UpdateCardDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

@Controller("cards")
export class CardController {
    constructor(
        private readonly createCard: CreateCardUseCase,
        private readonly getCard: GetCardUseCase,
        private readonly getAllCards: GetAllCardsUseCase,
        private readonly updateCard: UpdateCardUseCase,
        private readonly deleteCard: DeleteCardUseCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() body: CreateCardDto) {
        return this.createCard.execute({
            name: body.name,
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.getAllCards.execute();
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async findById(@Param("id") id: string) {
        return this.getCard.execute(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Body() updateCardDto: UpdateCardDto,
    ) {
        return this.updateCard.execute(id, updateCardDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.deleteCard.execute(id);
    }
}
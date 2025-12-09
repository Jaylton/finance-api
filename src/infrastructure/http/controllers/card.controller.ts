import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateCardUseCase } from "src/domain/card/services/create-card.usercase";
import { GetAllCardsUseCase } from "src/domain/card/services/get-all-cards.usercase";
import { GetCardUseCase } from "src/domain/card/services/get-card.usercase";

class CreateCardDto {
    name: string;
    email: string;
    password: string;
}

@Controller("cards")
export class CardController {
    constructor(
        private readonly createCard: CreateCardUseCase,
        private readonly getCard: GetCardUseCase,
        private readonly getAllCards: GetAllCardsUseCase,
    ) { }

    @Post()
    async create(@Body() body: CreateCardDto) {

        return this.createCard.execute({
            name: body.name,
        });
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.getCard.execute(id);
    }

    @Get()
    async findAll() {
        return this.getAllCards.execute();
    }
}
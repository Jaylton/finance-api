import { Module } from "@nestjs/common";
import { CardController } from "../controllers/card.controller";
import { CardRepositoryPrisma } from "../../persistence/prisma/card.repository.prisma";
import { PrismaService } from "src/prisma/prisma.service";
import { GetCardUseCase } from "src/domain/card/services/get-card.usercase";
import { CreateCardUseCase } from "src/domain/card/services/create-card.usercase";
import { GetAllCardsUseCase } from "src/domain/card/services/get-all-cards.usercase";
import { UpdateCardUseCase } from "src/domain/card/services/update-card.usercase";
import { DeleteCardUseCase } from "src/domain/card/services/delete-card.usercase";

@Module({
    controllers: [CardController],
    providers: [
        PrismaService,
        CreateCardUseCase,
        GetCardUseCase,
        GetAllCardsUseCase,
        UpdateCardUseCase,
        DeleteCardUseCase,
        {
            provide: 'CardRepositoryPort',
            useClass: CardRepositoryPrisma,
        },
    ],
    exports: ['CardRepositoryPort']
})
export class CardModule { }
import { CardRepositoryPort } from "../ports/card.repository.port";
import { Card } from "../entities/card.entity";
import { Inject } from "@nestjs/common";

export class GetAllCardsUseCase {
    constructor(
        @Inject('CardRepositoryPort')
        private readonly cardRepository: CardRepositoryPort
    ) { }

    async execute(): Promise<Card[] | null> {
        return await this.cardRepository.findAll();
    }
}
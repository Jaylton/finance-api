import { CardRepositoryPort } from "../ports/card.repository.port";
import { Card } from "../entities/card.entity";
import { Inject } from "@nestjs/common";

export class GetCardUseCase {
    constructor(
        @Inject('CardRepositoryPort')
        private readonly cardRepository: CardRepositoryPort
    ) { }

    async execute(id: string): Promise<Card | null> {
        return await this.cardRepository.findById(id);
    }
}
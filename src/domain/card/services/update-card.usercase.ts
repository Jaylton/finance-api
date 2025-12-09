import { CardRepositoryPort } from "../ports/card.repository.port";
import { Card } from "../entities/card.entity";
import { Inject } from "@nestjs/common";

export class UpdateCardUseCase {
    constructor(
        @Inject('CardRepositoryPort')
        private readonly cardRepository: CardRepositoryPort,
    ) { }

    async execute(id: string, input: {
        name: string;
    }): Promise<Card> {

        const card = new Card(
            id,
            input.name,
        );

        await this.cardRepository.update(id, card);

        return card;
    }
}
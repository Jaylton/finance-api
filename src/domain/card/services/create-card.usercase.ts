import { CardRepositoryPort } from "../ports/card.repository.port";
import { Card } from "../entities/card.entity";

export class CreateCardUseCase {
    constructor(
        private readonly cardRepository: CardRepositoryPort,
    ) { }

    async execute(input: {
        name: string;
    }): Promise<Card> {

        const card = new Card(
            crypto.randomUUID(),
            input.name,
        );

        await this.cardRepository.create(card);

        return card;
    }
}
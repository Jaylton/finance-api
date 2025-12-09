import { CardRepositoryPort } from "../ports/card.repository.port";
import { Card } from "../entities/card.entity";

export class GetAllCardsUseCase {
    constructor(private readonly cardRepository: CardRepositoryPort) { }

    async execute(): Promise<Card[] | null> {
        return await this.cardRepository.findAll();
    }
}
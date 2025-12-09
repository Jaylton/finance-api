import { CardRepositoryPort } from "../ports/card.repository.port";
import { Card } from "../entities/card.entity";

export class GetCardUseCase {
    constructor(private readonly cardRepository: CardRepositoryPort) { }

    async execute(id: string): Promise<Card | null> {
        return await this.cardRepository.findById(id);
    }
}
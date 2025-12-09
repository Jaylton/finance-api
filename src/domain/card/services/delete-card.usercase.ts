import { Inject } from "@nestjs/common";
import { CardRepositoryPort } from "../ports/card.repository.port";

export class DeleteCardUseCase {
    constructor(
        @Inject('CardRepositoryPort')
        private readonly cardRepository: CardRepositoryPort
    ) { }

    async execute(id: string): Promise<void> {
        return await this.cardRepository.delete(id);
    }
}
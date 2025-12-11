import { TransferRepositoryPort } from "../ports/transfer.repository.port";
import { Transfer } from "../entities/transfer.entity";
import { Inject } from "@nestjs/common";
import { GraphicResult } from "../dtos/graphic-result";

export class GetGraphicDataUseCase {
    constructor(
        @Inject('TransferRepositoryPort')
        private readonly transferRepository: TransferRepositoryPort
    ) { }

    async execute(query: any): Promise<GraphicResult[] | null> {
        return await this.transferRepository.graphic(query);
    }
}
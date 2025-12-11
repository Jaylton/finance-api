import { TransferRepositoryPort } from "../ports/transfer.repository.port";
import { Transfer } from "../entities/transfer.entity";
import { Inject } from "@nestjs/common";

export class GetAllTransfersUseCase {
    constructor(
        @Inject('TransferRepositoryPort')
        private readonly transferRepository: TransferRepositoryPort
    ) { }

    async execute(query: any): Promise<Transfer[] | null> {

        return await this.transferRepository.findAll(query);
    }
}
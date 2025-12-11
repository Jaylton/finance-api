import { Inject } from "@nestjs/common";
import { TransferRepositoryPort } from "../ports/transfer.repository.port";

export class DeleteTransferUseCase {
    constructor(
        @Inject('TransferRepositoryPort')
        private readonly transferRepository: TransferRepositoryPort
    ) { }

    async execute(id: string): Promise<void> {
        return await this.transferRepository.delete(id);
    }
}
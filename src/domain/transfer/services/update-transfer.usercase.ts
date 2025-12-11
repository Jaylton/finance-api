import { TransferRepositoryPort } from "../ports/transfer.repository.port";
import { Transfer } from "../entities/transfer.entity";
import { Inject } from "@nestjs/common";

export class UpdateTransferUseCase {
    constructor(
        @Inject('TransferRepositoryPort')
        private readonly transferRepository: TransferRepositoryPort,
    ) { }

    async execute(id: string, input: {
        name: string;
    }): Promise<Transfer> {

        const transfer = new Transfer(
            id,
            input.name,
        );

        await this.transferRepository.update(id, transfer);

        return transfer;
    }
}
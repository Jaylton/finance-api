import { TransferRepositoryPort } from "../ports/transfer.repository.port";
import { Transfer } from "../entities/transfer.entity";
import { Inject } from "@nestjs/common";

export class UpdateTransferUseCase {
    constructor(
        @Inject('TransferRepositoryPort')
        private readonly transferRepository: TransferRepositoryPort,
    ) { }

    async execute(id: string, transferData): Promise<Transfer> {

        const transfer = new Transfer(
            id,
            transferData.name,
            null,
            transferData.accountId || null,
            null,
            transferData.cardId || null,
            new Date(transferData.date + "T00:00:00.000Z"),
            transferData.type,
            transferData.installment || null,
            transferData.monthly,
            transferData.description || null,
            transferData.amount,
            transferData.categories
        );

        await this.transferRepository.update(id, transfer);

        return transfer;
    }
}
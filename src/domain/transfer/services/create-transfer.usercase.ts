import { TransferRepositoryPort } from "../ports/transfer.repository.port";
import { Transfer } from "../entities/transfer.entity";
import { Inject, NotFoundException } from "@nestjs/common";
import { CardRepositoryPort } from "src/domain/card/ports/card.repository.port";
import { AccountRepositoryPort } from "src/domain/account/ports/account.repository.port";

export class CreateTransferUseCase {
    constructor(
        @Inject('TransferRepositoryPort')
        private readonly transferRepository: TransferRepositoryPort,
        @Inject('CardRepositoryPort')
        private readonly cardRepository: CardRepositoryPort,
        @Inject('AccountRepositoryPort')
        private readonly accountRepository: AccountRepositoryPort,
    ) { }

    async execute(transferData: any): Promise<Transfer> {

        if (transferData.cardId) {
            const card = await this.cardRepository.findById(transferData.cardId);
            if (!card) {
                throw new NotFoundException(`Card with id ${transferData.cardId} not found`);
            }
        }
        if (transferData.accountId) {
            const account = await this.accountRepository.findById(transferData.accountId);
            if (!account) {
                throw new NotFoundException(`Account with id ${transferData.accountId} not found`);
            }
        }

        // verifica se já existe uma transferência igual
        const exist = await this.transferRepository.findFirstByParams({
            name: transferData.name,
            date: new Date(transferData.date + "T00:00:00.000Z"),
            amount: transferData.amount,
            accountId: transferData.accountId,
            cardId: transferData.cardId,
        });

        if (exist) {
            return exist;
        }

        const transfer = new Transfer(
            crypto.randomUUID(),
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
            transferData.categories.map((id: string) => ({ id }))
        );

        await this.transferRepository.create(transfer);

        return transfer;
    }
}
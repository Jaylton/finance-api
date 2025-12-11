import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TransferController } from "../controllers/transfer.controller";
import { CreateTransferUseCase } from "src/domain/transfer/services/create-transfer.usercase";
import { GetAllTransfersUseCase } from "src/domain/transfer/services/get-all-transfers.usercase";
import { UpdateTransferUseCase } from "src/domain/transfer/services/update-transfer.usercase";
import { DeleteTransferUseCase } from "src/domain/transfer/services/delete-transfer.usercase";
import { GetGraphicDataUseCase } from "src/domain/transfer/services/get-graphic-data.usercase";
import { TransferRepositoryPrisma } from "src/infrastructure/persistence/prisma/transfer.repository.prisma";
import { CardRepositoryPrisma } from "src/infrastructure/persistence/prisma/card.repository.prisma";
import { AccountRepositoryPrisma } from "src/infrastructure/persistence/prisma/account.repository.prisma";
import { ImportCSVUseCase } from "src/domain/transfer/services/import-csv.usercase";

@Module({
    controllers: [TransferController],
    providers: [
        PrismaService,
        CreateTransferUseCase,
        GetAllTransfersUseCase,
        UpdateTransferUseCase,
        DeleteTransferUseCase,
        GetGraphicDataUseCase,
        ImportCSVUseCase,
        {
            provide: 'TransferRepositoryPort',
            useClass: TransferRepositoryPrisma,
        },
        {
            provide: 'CardRepositoryPort',
            useClass: CardRepositoryPrisma,
        },
        {
            provide: 'AccountRepositoryPort',
            useClass: AccountRepositoryPrisma,
        },
    ],
    exports: ['TransferRepositoryPort']
})
export class TransferModule { }
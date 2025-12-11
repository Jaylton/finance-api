import { Module } from "@nestjs/common";
import { AccountController } from "../controllers/account.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { GetAccountUseCase } from "src/domain/account/services/get-account.usercase";
import { CreateAccountUseCase } from "src/domain/account/services/create-account.usercase";
import { GetAllAccountsUseCase } from "src/domain/account/services/get-all-accounts.usercase";
import { UpdateAccountUseCase } from "src/domain/account/services/update-account.usercase";
import { DeleteAccountUseCase } from "src/domain/account/services/delete-account.usercase";
import { AccountRepositoryPrisma } from "src/infrastructure/persistence/prisma/account.repository.prisma";

@Module({
    controllers: [AccountController],
    providers: [
        PrismaService,
        CreateAccountUseCase,
        GetAccountUseCase,
        GetAllAccountsUseCase,
        UpdateAccountUseCase,
        DeleteAccountUseCase,
        {
            provide: 'AccountRepositoryPort',
            useClass: AccountRepositoryPrisma,
        },
    ],
    exports: ['AccountRepositoryPort']
})
export class AccountModule { }
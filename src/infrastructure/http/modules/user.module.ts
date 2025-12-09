import { Module } from "@nestjs/common";
import { UserController } from "../controllers/user.controller";
import { UserRepositoryPrisma } from "../../persistence/prisma/user.repository.prisma";
import { CreateUserUseCase } from "../../../domain/user/services/create-user.usecase";
import { GetUserUseCase } from "../../../domain/user/services/get-user.usecase";
import { PrismaService } from "src/prisma/prisma.service";
import { PasswordHasherPort } from "src/domain/user/ports/password-hasher.port";
import { BcryptPasswordHasher } from "src/infrastructure/security/bcrypt-password.hasher";

@Module({
    controllers: [UserController],
    providers: [
        PrismaService,
        CreateUserUseCase,
        GetUserUseCase,
        {
            provide: "UserRepositoryPort",
            useClass: UserRepositoryPrisma,
        },
        {
            provide: PasswordHasherPort,
            useClass: BcryptPasswordHasher,
        },
    ],
    exports: ["UserRepositoryPort"]
})
export class UserModule { }
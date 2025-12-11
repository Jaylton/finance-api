import { AccountRepositoryPort } from "../ports/account.repository.port";
import { Account } from "../entities/account.entity";
import { Inject } from "@nestjs/common";

export class GetAccountUseCase {
    constructor(
        @Inject('AccountRepositoryPort')
        private readonly accountRepository: AccountRepositoryPort
    ) { }

    async execute(id: string): Promise<Account | null> {
        return await this.accountRepository.findById(id);
    }
}

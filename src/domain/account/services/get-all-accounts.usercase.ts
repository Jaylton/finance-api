import { AccountRepositoryPort } from "../ports/account.repository.port";
import { Account } from "../entities/account.entity";
import { Inject } from "@nestjs/common";

export class GetAllAccountsUseCase {
    constructor(
        @Inject('AccountRepositoryPort')
        private readonly accountRepository: AccountRepositoryPort
    ) { }

    async execute(): Promise<Account[] | null> {
        return await this.accountRepository.findAll();
    }
}

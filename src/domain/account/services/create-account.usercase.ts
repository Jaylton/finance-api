import { AccountRepositoryPort } from "../ports/account.repository.port";
import { Account } from "../entities/account.entity";
import { Inject } from "@nestjs/common";

export class CreateAccountUseCase {
    constructor(
        @Inject('AccountRepositoryPort')
        private readonly accountRepository: AccountRepositoryPort,
    ) { }

    async execute(input: {
        name: string;
        init_amount: number;
        current_amount: number;
    }): Promise<Account> {
        const account = new Account(
            crypto.randomUUID(),
            input.name,
            input.init_amount,
            input.current_amount,
        );
        await this.accountRepository.create(account);
        return account;
    }
}

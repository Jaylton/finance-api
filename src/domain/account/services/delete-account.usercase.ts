import { Inject } from "@nestjs/common";
import { AccountRepositoryPort } from "../ports/account.repository.port";

export class DeleteAccountUseCase {
    constructor(
        @Inject('AccountRepositoryPort')
        private readonly accountRepository: AccountRepositoryPort
    ) { }

    async execute(id: string): Promise<void> {
        return await this.accountRepository.delete(id);
    }
}

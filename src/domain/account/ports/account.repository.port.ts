import { Account } from "../entities/account.entity";

export abstract class AccountRepositoryPort {
    abstract findAll(): Promise<Account[] | null>;
    abstract findById(id: string): Promise<Account | null>;
    abstract create(account: Account): Promise<void>;
    abstract update(id: string, account: Account): Promise<Account | null>;
    abstract delete(id: string): Promise<void>;
}

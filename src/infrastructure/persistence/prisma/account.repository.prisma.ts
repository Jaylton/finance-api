import { Injectable } from "@nestjs/common";
import { Account } from "src/domain/account/entities/account.entity";
import { AccountRepositoryPort } from "src/domain/account/ports/account.repository.port";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountRepositoryPrisma implements AccountRepositoryPort {
    constructor(private prisma: PrismaService) { }

    async create(account: Account): Promise<void> {
        await this.prisma.account.create({
            data: {
                id: account.id,
                name: account.name,
                init_amount: account.init_amount,
                current_amount: account.current_amount,
            },
        });
    }

    async findById(id: string): Promise<Account | null> {
        const data = await this.prisma.account.findUnique({ where: { id } });

        if (!data) {
            return null;
        }

        return new Account(data.id, data.name, data.init_amount, data.current_amount);
    }

    async findAll(): Promise<Account[]> {
        const data = await this.prisma.account.findMany();

        return data.map((item) => new Account(item.id, item.name, item.init_amount, item.current_amount));
    }

    async update(id: string, account: Account): Promise<Account | null> {
        const exists = await this.findById(id);
        if (!exists) return null;

        const data = await this.prisma.account.update({
            where: { id },
            data: {
                name: account.name
            }
        });

        return new Account(data.id, data.name, data.init_amount, data.current_amount);
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);

        await this.prisma.account.delete({ where: { id } });
    }
}
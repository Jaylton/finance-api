import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepositoryPort } from "../../../domain/user/ports/user.repository.port";
import { User } from "../../../domain/user/entities/user.entity";

@Injectable()
export class UserRepositoryPrisma implements UserRepositoryPort {
    constructor(private prisma: PrismaService) { }

    async create(user: User): Promise<void> {
        await this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        });
    }

    async findById(id: string): Promise<User | null> {
        const data = await this.prisma.user.findUnique({ where: { id } });
        if (!data) return null;

        return new User(data.id, data.name, data.email, data.password);
    }

    async findByEmail(email: string): Promise<User | null> {
        const data = await this.prisma.user.findUnique({ where: { email } });
        if (!data) return null;

        return new User(data.id, data.name, data.email, data.password);
    }

    async findAll(): Promise<User[] | null> {
        return null;
    }

    async update(user: User): Promise<void> {

    }
}
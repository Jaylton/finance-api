import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { CardRepositoryPort } from "../../../domain/card/ports/card.repository.port";
import { Card } from "../../../domain/card/entities/card.entity";

@Injectable()
export class CardRepositoryPrisma implements CardRepositoryPort {
    constructor(private prisma: PrismaService) { }

    async create(card: Card): Promise<void> {
        await this.prisma.card.create({
            data: {
                id: card.id,
                name: card.name,
            },
        });
    }

    async findById(id: string): Promise<Card | null> {
        const data = await this.prisma.card.findUnique({ where: { id } });

        if (!data) {
            return null;
        }

        return new Card(data.id, data.name);
    }

    async findAll(): Promise<Card[]> {
        const data = await this.prisma.card.findMany();

        return data.map((item) => new Card(item.id, item.name));
    }

    async update(id: string, card: Card): Promise<Card | null> {
        const exists = await this.findById(id);
        if (!exists) return null;

        const data = await this.prisma.card.update({
            where: { id },
            data: {
                name: card.name
            }
        });

        return new Card(data.id, data.name);
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);

        await this.prisma.card.delete({ where: { id } });
    }
}
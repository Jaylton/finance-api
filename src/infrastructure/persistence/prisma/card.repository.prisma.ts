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
                name: card.name
            },
        });
    }

    async findById(id: string): Promise<Card | null> {
        const data = await this.prisma.card.findUnique({ where: { id } });
        if (!data) return null;

        return new Card(data.id, data.name);
    }

    async findAll(): Promise<Card[] | null> {
        return null;
    }

    async update(card: Card): Promise<void> {

    }

    async delete(card: Card): Promise<void> {
        
    }
}
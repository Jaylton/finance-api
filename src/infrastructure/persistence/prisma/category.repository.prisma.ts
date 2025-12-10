import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRepositoryPort } from "../../../domain/category/ports/category.repository.port";
import { Category } from "../../../domain/category/entities/category.entity";

@Injectable()
export class CategoryRepositoryPrisma implements CategoryRepositoryPort {
    constructor(private prisma: PrismaService) { }

    async create(category: Category): Promise<void> {
        await this.prisma.category.create({
            data: {
                id: category.id,
                name: category.name,
            },
        });
    }

    async findById(id: string): Promise<Category | null> {
        const data = await this.prisma.category.findUnique({ where: { id } });

        if (!data) {
            return null;
        }

        return new Category(data.id, data.name);
    }

    async findAll(): Promise<Category[]> {
        const data = await this.prisma.category.findMany();

        return data.map((item) => new Category(item.id, item.name));
    }

    async update(id: string, category: Category): Promise<Category | null> {
        const exists = await this.findById(id);
        if (!exists) return null;

        const data = await this.prisma.category.update({
            where: { id },
            data: {
                name: category.name
            }
        });

        return new Category(data.id, data.name);
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);

        await this.prisma.category.delete({ where: { id } });
    }
}
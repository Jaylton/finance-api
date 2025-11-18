
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class CategoriesService {

    constructor(private readonly prisma: PrismaService) {}

    async create(createCategoryDto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async findAll() {
        return this.prisma.category.findMany();
    }

    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new NotFoundException('Categoria não encontrada');
        }
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id); // lança NotFound se não existir
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id); // garante NotFound
        return this.prisma.category.delete({
            where: { id },
        });
    }
}

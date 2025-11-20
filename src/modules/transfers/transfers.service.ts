import { Injectable } from '@nestjs/common';
import { FindAllTransfersDto } from './dto/find-all-transfer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransfersService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: FindAllTransfersDto) {

        let dateFilter: any = undefined;
        if (query.startDate && query.endDate) {
            dateFilter = { gte: new Date(query.startDate), lte: new Date(query.endDate) };
        } else if (query.startDate) {
            dateFilter = { gte: new Date(query.startDate) };
        } else if (query.endDate) {
            dateFilter = { lte: new Date(query.endDate) };
        }

        const where: any = {
            ...(dateFilter && { date: dateFilter }),
            ...(query.type && { type: query.type }),
            ...(query.accountId && { accountId: query.accountId }),
            ...(query.cardId && { cardId: query.cardId }),
            ...(query.categoryId && { categories: { some: { id: query.categoryId } } }),
        };

        const transfers = await this.prisma.transfer.findMany({
            where,
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return transfers;
    }

    async create(transferData: CreateTransferDto) {
        return this.prisma.transfer.create({
            data: {
                name: transferData.name,
                date: transferData.date + "T00:00:00.000Z",
                type: transferData.type,
                amount: transferData.amount,
                description: transferData.description,
                accountId: transferData.accountId,
                cardId: transferData.cardId,
                installment: transferData.installment,
                monthly: transferData.monthly,
                categories: {
                    connect: transferData.categories?.map(id => ({ id })),
                },
            },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async update(id: number, updateData: Partial<CreateTransferDto>) {
        const { categories, ...rest } = updateData;

        // Monta a estrutura base do update
        const data: any = {
            ...rest,
            date: rest.date ? rest.date + "T00:00:00.000Z" : undefined,
        };

        // Se o usuário enviou categorias no update:
        if (categories) {
            data.categories = {
                set: categories.map(id => ({ id })), // substitui tudo
            };
        }

        return this.prisma.transfer.update({
            where: { id },
            data,
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async remove(id: number) {
        return this.prisma.transfer.delete({
            where: { id },
        });
    }
}

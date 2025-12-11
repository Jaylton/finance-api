import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferRepositoryPort } from 'src/domain/transfer/ports/transfer.repository.port';
import { TransferSearchCriteria } from 'src/domain/transfer/dtos/transfer-search-criteria';
import { Transfer } from 'src/domain/transfer/entities/transfer.entity';
import { Prisma } from '@prisma/client';
import { Category } from 'src/domain/category/entities/category.entity';
import { GraphicResult } from 'src/domain/transfer/dtos/graphic-result';

@Injectable()
export class TransferRepositoryPrisma implements TransferRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(criteria: TransferSearchCriteria): Promise<Transfer[]> {

        let dateFilter: any = undefined;
        if (criteria.startDate && criteria.endDate) {
            dateFilter = { gte: criteria.startDate, lte: criteria.endDate };
        } else if (criteria.startDate) {
            dateFilter = { gte: criteria.startDate };
        } else if (criteria.endDate) {
            dateFilter = { lte: criteria.endDate };
        }

        const where: Prisma.TransferWhereInput = {
            ...(dateFilter && { date: dateFilter }),
            ...(criteria.type && { type: criteria.type }),
            ...(criteria.accountId && { accountId: criteria.accountId }),
            ...(criteria.cardId && { cardId: criteria.cardId }),
        };

        if (criteria.categoryIds && criteria.categoryIds.length > 0) {
            if (criteria.categoryIds.includes('0')) {
                where.categories = { none: {} };
            } else {
                const validIds = criteria.categoryIds.filter(id => id != '0');
                if (validIds.length > 0) {
                    where.categories = { some: { id: { in: validIds } } };
                }
            }
        }

        const prismaTransfers = await this.prisma.transfer.findMany({
            where,
            include: {
                categories: { select: { id: true, name: true } },
            },
        });

        return prismaTransfers.map(t => new Transfer(
            t.id,
            t.name,
            null,
            t.accountId,
            null,
            t.cardId,
            t.date,
            t.type,
            t.installment,
            t.monthly,
            t.description,
            t.amount,
            t.categories.map(c => new Category(c.id, c.name)),
        ));
    }

    async graphic(criteria: TransferSearchCriteria): Promise<GraphicResult[]> {

        const filters: Prisma.Sql[] = [];

        // Filtro por data
        if (criteria.startDate) {
            filters.push(Prisma.sql`AND date >= ${new Date(criteria.startDate)}`);
        }

        if (criteria.endDate) {
            filters.push(Prisma.sql`AND date <= ${new Date(criteria.endDate)}`);
        }

        // Filtro por tipo
        if (criteria.type) {
            filters.push(Prisma.sql`AND type = ${criteria.type}`);
        }

        // Filtro por conta
        if (criteria.accountId) {
            filters.push(Prisma.sql`AND accountId = ${criteria.accountId}`);
        }

        // Filtro por cartão
        if (criteria.cardId) {
            filters.push(Prisma.sql`AND cardId = ${criteria.cardId}`);
        }

        // Filtro por categorias (many-to-many)
        if (criteria.categoryIds && criteria.categoryIds.length > 0) {
            if (criteria.categoryIds.includes("0")) {
                filters.push(
                    Prisma.sql`
                        AND id NOT IN (
                        SELECT B
                        FROM _CategoryToTransfer
                        )
                    `
                );
            } else {
                filters.push(
                    Prisma.sql`
                    AND id IN (
                    SELECT B
                    FROM _CategoryToTransfer
                    WHERE A IN (${Prisma.join(criteria.categoryIds)})
                    )
                `
                );
            }
        }

        const sql = Prisma.sql`
            SELECT 
            MONTH(date) AS mes,
            YEAR(date) AS ano,
            SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investimentos,
            SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS total_entradas,
            SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS total_saidas
            FROM Transfer
            WHERE 1=1
            ${Prisma.join(filters, ' ')}
            GROUP BY YEAR(date), MONTH(date)
            ORDER BY ano DESC, mes DESC
        `;

        return this.prisma.$queryRaw`${sql}`;
    }

    async findLastByName(name: string): Promise<Transfer | null> {
        const transfers = await this.prisma.transfer.findMany({
            where: {
                name: {
                    contains: name,
                },
                categories: {
                    some: {},
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
            orderBy: { id: 'desc' },
        });

        if (transfers.length === 0) {
            return null;
        }

        const t = transfers[0];
        return new Transfer(
            t.id,
            t.name,
            null,
            t.accountId,
            null,
            t.cardId,
            t.date,
            t.type,
            t.installment,
            t.monthly,
            t.description,
            t.amount,
            t.categories.map(c => new Category(c.id, c.name)),
        );
    }

    async findFirstByParams(params: Partial<Transfer>): Promise<Transfer | null> {

        const transfer = await this.prisma.transfer.findFirst({
            where: {
                name: params.name,
                date: new Date(params.date + "T00:00:00.000Z"),
                amount: params.amount,
                accountId: params.accountId,
                cardId: params.cardId,
            },
            include: {
                categories: { select: { id: true, name: true } },
            },
        });

        if (!transfer) {
            return null;
        }

        const t = transfer;

        return new Transfer(
            t.id,
            t.name,
            null,
            t.accountId,
            null,
            t.cardId,
            t.date,
            t.type,
            t.installment,
            t.monthly,
            t.description,
            t.amount,
            t.categories.map(c => new Category(c.id, c.name)),
        );
    }

    async create(transfer: Transfer): Promise<Transfer> {
        const t = await this.prisma.transfer.create({
            data: {
                id: transfer.id,
                name: transfer.name,
                date: transfer.date + "T00:00:00.000Z",
                type: transfer.type,
                amount: transfer.amount,
                description: transfer.description,
                accountId: transfer.accountId,
                cardId: transfer.cardId,
                installment: transfer.installment,
                monthly: transfer.monthly,
                categories: {
                    connect: transfer.categories?.map(c => ({ id: c.id })),
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

        return new Transfer(
            t.id,
            t.name,
            null,
            t.accountId,
            null,
            t.cardId,
            t.date,
            t.type,
            t.installment,
            t.monthly,
            t.description,
            t.amount,
            t.categories.map(c => new Category(c.id, c.name)),
        );
    }

    update(id: string, transfer: Transfer): Promise<Transfer | null> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<void> {
        await this.prisma.transfer.delete({ where: { id } });
    }

}
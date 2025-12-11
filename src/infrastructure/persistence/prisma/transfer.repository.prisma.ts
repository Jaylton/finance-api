import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferRepositoryPort } from 'src/domain/transfer/ports/transfer.repository.port';
import { TransferSearchCriteria } from 'src/domain/transfer/dtos/transfer-search-criteria';
import { Transfer } from 'src/domain/transfer/entities/transfer.entity';
import { Prisma } from '@prisma/client';
import { Category } from 'src/domain/category/entities/category.entity';
import { GraphicResult } from 'src/domain/transfer/dtos/graphic-result';
import { convertBigInt } from 'src/commons/utils';

@Injectable()
export class TransferRepositoryPrisma implements TransferRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    private readonly transferInclude = {
        categories: { select: { id: true, name: true } },
    };

    private mapPrismaToDomain(t: any): Transfer {
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
            t.categories.map((c: any) => new Category(c.id, c.name)),
        );
    }

    async findAll(criteria: TransferSearchCriteria): Promise<Transfer[]> {

        let dateFilter: any = undefined;
        if (criteria.startDate && criteria.endDate) {
            dateFilter = { gte: criteria.startDate + "T00:00:00.000Z", lte: criteria.endDate + "T00:00:00.000Z" };
        } else if (criteria.startDate) {
            dateFilter = { gte: criteria.startDate + "T00:00:00.000Z" };
        } else if (criteria.endDate) {
            dateFilter = { lte: criteria.endDate + "T00:00:00.000Z" };
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
            orderBy: { date: 'asc' },
            include: this.transferInclude,
        });

        return prismaTransfers.map(t => this.mapPrismaToDomain(t));
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
        const result = await this.prisma.$queryRaw(sql);
        return convertBigInt(result);
    }

    async findLastByName(name: string): Promise<Transfer | null> {
        const transfers = await this.prisma.transfer.findMany({
            where: {
                name: { contains: name },
                categories: { some: {} },
            },
            include: this.transferInclude,
            orderBy: { id: 'desc' },
        });

        if (transfers.length === 0) return null;

        return this.mapPrismaToDomain(transfers[0]);
    }

    async findFirstByParams(params: Partial<Transfer>): Promise<Transfer | null> {

        const transfer = await this.prisma.transfer.findFirst({
            where: {
                name: params.name,
                date: params.date,
                amount: params.amount,
                accountId: params.accountId,
                cardId: params.cardId,
            },
            include: this.transferInclude,
        });

        if (!transfer) return null;

        return this.mapPrismaToDomain(transfer);
    }

    async create(transfer: Transfer): Promise<Transfer> {
        const t = await this.prisma.transfer.create({
            data: {
                id: transfer.id,
                name: transfer.name,
                date: transfer.date,
                type: transfer.type,
                amount: transfer.amount,
                description: transfer.description,
                accountId: transfer.accountId,
                cardId: transfer.cardId,
                installment: transfer.installment,
                monthly: transfer.monthly,
                categories: { connect: transfer.categories?.map(c => ({ id: c.id })) },
            },
            include: this.transferInclude,
        });

        return this.mapPrismaToDomain(t);
    }

    async update(id: string, transfer: Transfer): Promise<Transfer | null> {
        const categories = transfer.categories;
        
        // Monta a estrutura base do update
        const data: any = {
            id: transfer.id,
            name: transfer.name,
            type: transfer.type,
            amount: transfer.amount,
            description: transfer.description,
            accountId: transfer.accountId,
            cardId: transfer.cardId,
            installment: transfer.installment,
            monthly: transfer.monthly,
            date: transfer.date ? transfer.date : undefined,
        };

        // Se o usuário enviou categorias no update:
        if (categories) {
            data.categories = {
                set: categories.map(id => ({ id })), // substitui tudo
            };
        }

        const t = await this.prisma.transfer.update({
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
        
        return this.mapPrismaToDomain(t);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.transfer.delete({ where: { id } });
    }

}
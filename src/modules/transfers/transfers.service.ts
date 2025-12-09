// import { Injectable, NotFoundException } from '@nestjs/common';
// import { FindAllTransfersDto } from './dto/find-all-transfer.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateTransferDto } from './dto/create-transfer.dto';
// import { Prisma } from '@prisma/client';
// import { convertBigInt, parseDate } from '../../commons/utils';
// import csvParser from 'csv-parser';
// import { Readable } from 'stream';

// @Injectable()
// export class TransfersService {

//     constructor(private readonly prisma: PrismaService) { }

//     async findAll(query: FindAllTransfersDto) {

//         let dateFilter: any = undefined;
//         if (query.startDate && query.endDate) {
//             dateFilter = { gte: new Date(query.startDate), lte: new Date(query.endDate) };
//         } else if (query.startDate) {
//             dateFilter = { gte: new Date(query.startDate) };
//         } else if (query.endDate) {
//             dateFilter = { lte: new Date(query.endDate) };
//         }

//         const where: any = {
//             ...(dateFilter && { date: dateFilter }),
//             ...(query.type && { type: query.type }),
//             ...(query.accountId && { accountId: query.accountId }),
//             ...(query.cardId && { cardId: query.cardId }),
//         };

//         if (Array.isArray(query.categoryIds) && query.categoryIds.length > 0) {
//             if (query.categoryIds.includes(-1)) {
//                 where.categories = {
//                     none: {},
//                 };
//             } else {
//                 const validIds = query.categoryIds.filter(id => id > 0);
//                 if (validIds.length > 0) {
//                     where.categories = {
//                         some: {
//                             id: { in: validIds },
//                         },
//                     };
//                 }
//             }
//         }

//         const transfers = await this.prisma.transfer.findMany({
//             where,
//             include: {
//                 categories: {
//                     select: {
//                         id: true,
//                         name: true,
//                     },
//                 },
//             },
//         });
//         return transfers;
//     }

//     async findLastByName(name: string) {
//         const transfers = await this.prisma.transfer.findMany({
//             where: {
//                 name: {
//                     contains: name,
//                 },
//                 categories: {
//                     some: {},
//                 },
//             },
//             include: {
//                 categories: {
//                     select: {
//                         id: true,
//                         name: true,
//                     },
//                 },
//             },
//             orderBy: { id: 'desc' },
//         });
//         return transfers.length > 0 ? transfers[0] : null;
//     }

//     async graphic(query: FindAllTransfersDto) {
//         const filters: Prisma.Sql[] = [];

//         // Filtro por data
//         if (query.startDate) {
//             filters.push(Prisma.sql`AND date >= ${new Date(query.startDate)}`);
//         }

//         if (query.endDate) {
//             filters.push(Prisma.sql`AND date <= ${new Date(query.endDate)}`);
//         }

//         // Filtro por tipo
//         if (query.type) {
//             filters.push(Prisma.sql`AND type = ${query.type}`);
//         }

//         // Filtro por conta
//         if (query.accountId) {
//             filters.push(Prisma.sql`AND accountId = ${query.accountId}`);
//         }

//         // Filtro por cartão
//         if (query.cardId) {
//             filters.push(Prisma.sql`AND cardId = ${query.cardId}`);
//         }

//         // Filtro por categorias (many-to-many)
//         if (query.categoryIds && query.categoryIds.length > 0) {
//             if (query.categoryIds.includes(-1)) {
//                 filters.push(
//                     Prisma.sql`
//                         AND id NOT IN (
//                         SELECT B
//                         FROM _CategoryToTransfer
//                         )
//                     `
//                 );
//             } else {
//                 filters.push(
//                     Prisma.sql`
//                     AND id IN (
//                     SELECT B
//                     FROM _CategoryToTransfer
//                     WHERE A IN (${Prisma.join(query.categoryIds)})
//                     )
//                 `
//                 );
//             }
//         }

//         const sql = Prisma.sql`
//             SELECT 
//             MONTH(date) AS mes,
//             YEAR(date) AS ano,
//             SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investimentos,
//             SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS total_entradas,
//             SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS total_saidas
//             FROM Transfer
//             WHERE 1=1
//             ${Prisma.join(filters, ' ')}
//             GROUP BY YEAR(date), MONTH(date)
//             ORDER BY ano DESC, mes DESC
//         `;

//         const result = await this.prisma.$queryRaw`${sql}`;
//         return convertBigInt(result);
//     }

//     async create(transferData: CreateTransferDto) {
//         if (transferData.cardId) {
//             const card = await this.prisma.card.findUnique({
//                 where: { id: transferData.cardId },
//             });
//             if (!card) {
//                 throw new NotFoundException(`Card with id ${transferData.cardId} not found`);
//             }
//         }
//         if (transferData.accountId) {
//             const account = await this.prisma.account.findUnique({
//                 where: { id: transferData.accountId },
//             });
//             if (!account) {
//                 throw new NotFoundException(`Account with id ${transferData.accountId} not found`);
//             }
//         }

//         // verifica se já existe uma transferência igual
//         const exist = await this.prisma.transfer.findFirst({
//             where: {
//                 name: transferData.name,
//                 date: new Date(transferData.date + "T00:00:00.000Z"),
//                 amount: transferData.amount,
//                 accountId: transferData.accountId,
//                 cardId: transferData.cardId,
//             },
//         });

//         if (exist) {
//             return exist;
//         }

//         return this.prisma.transfer.create({
//             data: {
//                 name: transferData.name,
//                 date: transferData.date + "T00:00:00.000Z",
//                 type: transferData.type,
//                 amount: transferData.amount,
//                 description: transferData.description,
//                 accountId: transferData.accountId,
//                 cardId: transferData.cardId,
//                 installment: transferData.installment,
//                 monthly: transferData.monthly,
//                 categories: {
//                     connect: transferData.categories?.map(id => ({ id })),
//                 },
//             },
//             include: {
//                 categories: {
//                     select: {
//                         id: true,
//                         name: true,
//                     },
//                 },
//             },
//         });
//     }

//     async update(id: number, updateData: Partial<CreateTransferDto>) {
//         const { categories, ...rest } = updateData;

//         // Monta a estrutura base do update
//         const data: any = {
//             ...rest,
//             date: rest.date ? rest.date + "T00:00:00.000Z" : undefined,
//         };

//         // Se o usuário enviou categorias no update:
//         if (categories) {
//             data.categories = {
//                 set: categories.map(id => ({ id })), // substitui tudo
//             };
//         }

//         return this.prisma.transfer.update({
//             where: { id },
//             data,
//             include: {
//                 categories: {
//                     select: {
//                         id: true,
//                         name: true,
//                     },
//                 },
//             },
//         });
//     }

//     async remove(id: number) {
//         return this.prisma.transfer.delete({
//             where: { id },
//         });
//     }

//     /**
//      * Importa transferências a partir de um arquivo CSV.
//      * Valida e trata dados, retorna detalhes de sucesso e erro por linha.
//      */
//     async importCsv(fileBuffer: Buffer, accountId?: number, cardId?: number) {
//         type CsvRow = { date: string; description: string; amount: string | number };
//         type ImportResult = { id?: number; line: number; success: boolean; error?: string };

//         const results: CsvRow[] = [];
//         const stream = Readable.from(fileBuffer);

//         // Extrair os dados do CSV
//         const data: CsvRow[] = await new Promise((resolve, reject) => {
//             stream
//                 .pipe(csvParser())
//                 .on('data', (row) => {
//                     results.push(row);
//                 })
//                 .on('end', () => resolve(results))
//                 .on('error', (err) => reject(err));
//         });

//         const response: ImportResult[] = [];

//         for (let i = 0; i < data.length; i++) {
//             const element = data[i];
//             try {
//                 // Validação básica dos campos
//                 if (!element.date || !element.description || element.amount === undefined || element.amount === null) {
//                     response.push({ line: i + 1, success: false, error: 'Campos obrigatórios ausentes' });
//                     continue;
//                 }

//                 const parsedDate = parseDate(element.date);
//                 if (!parsedDate) {
//                     response.push({ line: i + 1, success: false, error: 'Data inválida' });
//                     continue;
//                 }

//                 const amount = typeof element.amount === 'string' ? Number(element.amount.replace(',', '.')) : Number(element.amount);
//                 if (isNaN(amount)) {
//                     response.push({ line: i + 1, success: false, error: 'Valor inválido' });
//                     continue;
//                 }

//                 // Busca categorias por similaridade, se houver descrição
//                 let categories: number[] | undefined = undefined;
//                 if (element.description) {
//                     try {
//                         const lastTransfer = await this.findLastByName(element.description);
//                         if (lastTransfer && lastTransfer.categories) {
//                             categories = lastTransfer.categories.map((cat: any) => cat.id);
//                         }
//                     } catch (e) {
//                         // ignora erro de busca de categoria
//                     }
//                 }

//                 const transfer: CreateTransferDto = {
//                     date: parsedDate,
//                     name: element.description,
//                     amount,
//                     description: `Importado do csv; ${element.description}`,
//                     type: amount >= 0 ? 'INCOME' : 'EXPENSE',
//                     ...(accountId ? { accountId: Number(accountId) } : {}),
//                     ...(cardId ? { cardId: Number(cardId) } : {}),
//                     ...(categories ? { categories } : {}),
//                 };

//                 const createdTransfer = await this.create(transfer);
//                 response.push({ id: createdTransfer.id, line: i + 1, success: true });
//             } catch (err: any) {
//                 response.push({ line: i + 1, success: false, error: err?.message || 'Erro desconhecido' });
//             }
//         }

//         return { results: response };
//     }
// }
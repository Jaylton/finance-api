import { TransferRepositoryPort } from "../ports/transfer.repository.port";
import { Transfer } from "../entities/transfer.entity";
import { Inject, NotFoundException } from "@nestjs/common";
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { parseDate } from "src/commons/utils";
import { Category } from "src/domain/category/entities/category.entity";

type ImportResult = { id?: string; line: number; success: boolean; error?: string };
type CsvRow = { date: string; description: string; amount: string | number };


export class ImportCSVUseCase {
    constructor(
        @Inject('TransferRepositoryPort')
        private readonly transferRepository: TransferRepositoryPort,
    ) { }


    async execute(fileBuffer: Buffer, accountId?: string, cardId?: string): Promise<{ results: ImportResult[] }> {

        const results: CsvRow[] = [];
        const stream = Readable.from(fileBuffer);

        // Extrair os dados do CSV
        const data: CsvRow[] = await new Promise((resolve, reject) => {
            stream
                .pipe(csvParser())
                .on('data', (row) => {
                    results.push(row);
                })
                .on('end', () => resolve(results))
                .on('error', (err) => reject(err));
        });

        const response: ImportResult[] = [];

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            try {
                // Validação básica dos campos
                if (!element.date || !element.description || element.amount === undefined || element.amount === null) {
                    response.push({ line: i + 1, success: false, error: 'Campos obrigatórios ausentes' });
                    continue;
                }

                const parsedDate = parseDate(element.date);
                if (!parsedDate) {
                    response.push({ line: i + 1, success: false, error: 'Data inválida' });
                    continue;
                }

                const amount = typeof element.amount === 'string' ? Number(element.amount.replace(',', '.')) : Number(element.amount);
                if (isNaN(amount)) {
                    response.push({ line: i + 1, success: false, error: 'Valor inválido' });
                    continue;
                }

                // Busca categorias por similaridade, se houver descrição
                let categories: string[] | undefined = undefined;
                if (element.description) {
                    try {
                        const lastTransfer = await this.transferRepository.findLastByName(element.description);
                        if (lastTransfer && lastTransfer.categories) {
                            categories = lastTransfer.categories.map((cat: any) => cat.id);
                        }
                    } catch (e) {
                        // ignora erro de busca de categoria
                    }
                }

                const transfer = new Transfer(
                    crypto.randomUUID(),
                    element.description,
                    null,
                    (accountId ? String(accountId) : null),
                    null,
                    (cardId ? String(cardId) : null),
                    new Date(parsedDate + "T00:00:00.000Z"),
                    amount >= 0 ? 'INCOME' : 'EXPENSE',
                    null,
                    false,
                    `Importado do csv; ${element.description}`,
                    amount,
                    (categories ? categories : []).map((id: string) => (new Category(id, '')))
                );

                const createdTransfer = await this.transferRepository.create(transfer);
                response.push({ id: createdTransfer.id, line: i + 1, success: true });
            } catch (err: any) {
                response.push({ line: i + 1, success: false, error: err?.message || 'Erro desconhecido' });
            }
        }

        return { results: response };

    }
}
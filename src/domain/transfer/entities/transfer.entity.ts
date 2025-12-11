import { Account } from "src/domain/account/entities/account.entity";
import { Card } from "src/domain/card/entities/card.entity";
import { Category } from "src/domain/category/entities/category.entity";
export class Transfer {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly account: Account | null,
        readonly accountId: string | null,
        readonly card: Card | null,
        readonly cardId: string | null,
        readonly date: Date,
        readonly type: 'EXPENSE' | 'INCOME' | 'INVESTMENT',
        readonly installment: number | null,
        readonly monthly: boolean,
        readonly description: string | null,
        readonly amount: number,
        readonly categories: Category[],
    ) { }
}
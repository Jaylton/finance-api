import { IsDateString, IsOptional } from "class-validator";

export class FindAllTransfersDto {
    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsOptional()
    type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';

    @IsOptional()
    accountId?: number;

    @IsOptional()
    cardId?: number;

    @IsOptional()
    categoryId?: number;
}
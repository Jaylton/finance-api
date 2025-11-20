import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsOptional } from "class-validator";

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
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    @Transform(({ value }) => {
        if (value === undefined || value === null) return undefined;

        // Se vier só um número (string), vira array
        if (!Array.isArray(value)) return [Number(value)];

        // Se já for array, transforma cada item em número
        return value.map(v => Number(v));
    })
    categoryIds?: number[];
}
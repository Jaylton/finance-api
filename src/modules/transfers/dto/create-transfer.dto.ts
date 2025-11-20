import { IsNotEmpty, IsString, IsOptional, IsInt, IsDateString, IsEnum, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateTransferDto {
  @IsOptional()
  @IsInt()
  accountId?: number;

  @IsOptional()
  @IsInt()
  cardId?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsEnum(['EXPENSE', 'INCOME', 'INVESTMENT'])
  type: 'EXPENSE' | 'INCOME' | 'INVESTMENT';

  @IsOptional()
  @IsInt()
  installment?: number;

  @IsOptional()
  @IsBoolean()
  monthly?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  categories?: number[];
}

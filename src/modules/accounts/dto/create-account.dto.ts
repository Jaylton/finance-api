import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  init_amount: number;

  @IsNumber()
  @IsOptional()
  current_amount: number;
}

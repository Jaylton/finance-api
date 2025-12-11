import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateAccountUseCase } from "src/domain/account/services/create-account.usercase";
import { DeleteAccountUseCase } from "src/domain/account/services/delete-account.usercase";
import { GetAllAccountsUseCase } from "src/domain/account/services/get-all-accounts.usercase";
import { GetAccountUseCase } from "src/domain/account/services/get-account.usercase";
import { UpdateAccountUseCase } from "src/domain/account/services/update-account.usercase";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt.guard";

class CreateAccountDto {
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

class UpdateAccountDto {
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

@Controller("categories")
export class AccountController {
    constructor(
        private readonly createAccount: CreateAccountUseCase,
        private readonly getAccount: GetAccountUseCase,
        private readonly getAllAccounts: GetAllAccountsUseCase,
        private readonly updateAccount: UpdateAccountUseCase,
        private readonly deleteAccount: DeleteAccountUseCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() body: CreateAccountDto) {
        return this.createAccount.execute({
            name: body.name,
            init_amount: body.init_amount,
            current_amount: body.current_amount,
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.getAllAccounts.execute();
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async findById(@Param("id") id: string) {
        return this.getAccount.execute(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
    ) {
        return this.updateAccount.execute(id, updateAccountDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.deleteAccount.execute(id);
    }
}
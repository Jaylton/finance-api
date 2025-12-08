import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateUserUseCase } from "../../../domain/user/services/create-user.usecase";
import { GetUserUseCase } from "../../../domain/user/services/get-user.usecase";

class CreateUserDto {
    name: string;
    email: string;
    password: string;
}

@Controller("users")
export class UserController {
    constructor(
        private readonly createUser: CreateUserUseCase,
        private readonly getUser: GetUserUseCase,
    ) { }

    @Post()
    async create(@Body() body: CreateUserDto) {

        return this.createUser.execute({
            name: body.name,
            email: body.email,
            password: body.password,
        });
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.getUser.execute(id);
    }
}
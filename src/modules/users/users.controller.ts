import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}


    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    }


    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }


    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.usersService.update(id, updateUserDto);
    }
}
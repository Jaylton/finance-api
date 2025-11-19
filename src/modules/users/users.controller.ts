import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.usersService.update(id, updateUserDto);
    }
}
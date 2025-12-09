// import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { UserResponseDto } from './dto/user-response.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {

//     constructor(private readonly prisma: PrismaService) { }


//     async findAll(): Promise<UserResponseDto[]> {
//         const users = await this.prisma.user.findMany();
//         return users.map(({ password, ...user }) => user);
//     }


//     async findOne(id: number): Promise<UserResponseDto> {
//         const user = await this.prisma.user.findUnique({
//             where: { id },
//         });
//         if (!user) {
//             throw new NotFoundException(`User with id ${id} not found`);
//         }
//         // Remove password
//         const { password, ...userResponse } = user;
//         return userResponse;
//     }


//     async create(userData: CreateUserDto): Promise<UserResponseDto> {
//         const hashed = await bcrypt.hash(userData.password, 10);
//         const newUser = { ...userData, password: hashed };
//         const user = await this.prisma.user.create({
//             data: newUser,
//         });
//         const { password, ...userResponse } = user;
//         return userResponse;
//     }


//     async update(id: number, updateData: UpdateUserDto): Promise<UserResponseDto> {
//         await this.findOne(id); // lança NotFound se não existir
//         const user = await this.prisma.user.update({
//             where: { id },
//             data: updateData,
//         });
//         const { password, ...userResponse } = user;
//         return userResponse;
//     }


//     async remove(id: number): Promise<UserResponseDto> {
//         await this.findOne(id); // garante NotFound
//         const user = await this.prisma.user.delete({
//             where: { id },
//         });
//         const { password, ...userResponse } = user;
//         return userResponse;
//     }
// }
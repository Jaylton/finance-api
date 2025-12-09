// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateAccountDto } from './dto/create-account.dto';
// import { UpdateAccountDto } from './dto/update-account.dto';

// @Injectable()
// export class AccountsService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(createAccountDto: CreateAccountDto) {
//     return this.prisma.account.create({ data: createAccountDto });
//   }

//   async findAll() {
//     return this.prisma.account.findMany();
//   }

//   async findOne(id: number) {
//     const account = await this.prisma.account.findUnique({ where: { id } });
//     if (!account) {
//       throw new NotFoundException('Account não encontrada');
//     }
//     return account;
//   }

//   async update(id: number, updateAccountDto: UpdateAccountDto) {
//     await this.findOne(id);
//     return this.prisma.account.update({ where: { id }, data: updateAccountDto });
//   }

//   async remove(id: number) {
//     await this.findOne(id);
//     return this.prisma.account.delete({ where: { id } });
//   }
// }

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateCardDto } from './dto/create-card.dto';
// import { UpdateCardDto } from './dto/update-card.dto';

// @Injectable()
// export class CardsService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(createCardDto: CreateCardDto) {
//     return this.prisma.card.create({ data: createCardDto });
//   }

//   async findAll() {
//     return this.prisma.card.findMany();
//   }

//   async findOne(id: string) {
//     const card = await this.prisma.card.findUnique({ where: { id } });
//     if (!card) {
//       throw new NotFoundException('Card não encontrado');
//     }
//     return card;
//   }

//   async update(id: string, updateCardDto: UpdateCardDto) {
//     await this.findOne(id);
//     return this.prisma.card.update({ where: { id }, data: updateCardDto });
//   }

//   async remove(id: string) {
//     await this.findOne(id);
//     return this.prisma.card.delete({ where: { id } });
//   }
// }

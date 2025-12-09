// import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
// import { CategoriesService } from './categories.service';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
// import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

// @Controller('categories')
// export class CategoriesController {
//   constructor(private readonly categoriesService: CategoriesService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   create(@Body() createCategoryDto: CreateCategoryDto) {
//     return this.categoriesService.create(createCategoryDto);
//   }

//   @Get()
//   @UseGuards(JwtAuthGuard)
//   findAll() {
//     return this.categoriesService.findAll();
//   }

//   @Get(':id')
//   @UseGuards(JwtAuthGuard)
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.categoriesService.findOne(id);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard)
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateCategoryDto: UpdateCategoryDto,
//   ) {
//     return this.categoriesService.update(id, updateCategoryDto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard)
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     await this.categoriesService.remove(id);
//     return { message: 'Categoria removida com sucesso' };
//   }
// }

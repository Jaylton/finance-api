import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateCategoryUseCase } from "src/domain/category/services/create-category.usercase";
import { DeleteCategoryUseCase } from "src/domain/category/services/delete-category.usercase";
import { GetAllCategoriesUseCase } from "src/domain/category/services/get-all-categories.usercase";
import { GetCategoryUseCase } from "src/domain/category/services/get-category.usercase";
import { UpdateCategoryUseCase } from "src/domain/category/services/update-category.usercase";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt.guard";

class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

class UpdateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}

@Controller("categories")
export class CategoryController {
    constructor(
        private readonly createCategory: CreateCategoryUseCase,
        private readonly getCategory: GetCategoryUseCase,
        private readonly getAllCategories: GetAllCategoriesUseCase,
        private readonly updateCategory: UpdateCategoryUseCase,
        private readonly deleteCategory: DeleteCategoryUseCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() body: CreateCategoryDto) {
        return this.createCategory.execute({
            name: body.name,
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.getAllCategories.execute();
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async findById(@Param("id") id: string) {
        return this.getCategory.execute(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.updateCategory.execute(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.deleteCategory.execute(id);
    }
}
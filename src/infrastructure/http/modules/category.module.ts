import { Module } from "@nestjs/common";
import { CategoryController } from "../controllers/category.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { GetCategoryUseCase } from "src/domain/category/services/get-category.usercase";
import { CreateCategoryUseCase } from "src/domain/category/services/create-category.usercase";
import { GetAllCategoriesUseCase } from "src/domain/category/services/get-all-categories.usercase";
import { UpdateCategoryUseCase } from "src/domain/category/services/update-category.usercase";
import { DeleteCategoryUseCase } from "src/domain/category/services/delete-category.usercase";
import { CategoryRepositoryPrisma } from "src/infrastructure/persistence/prisma/category.repository.prisma";

@Module({
    controllers: [CategoryController],
    providers: [
        PrismaService,
        CreateCategoryUseCase,
        GetCategoryUseCase,
        GetAllCategoriesUseCase,
        UpdateCategoryUseCase,
        DeleteCategoryUseCase,
        {
            provide: 'CategoryRepositoryPort',
            useClass: CategoryRepositoryPrisma,
        },
    ],
    exports: ['CategoryRepositoryPort']
})
export class CategoryModule { }
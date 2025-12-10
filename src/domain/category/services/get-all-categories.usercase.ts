import { CategoryRepositoryPort } from "../ports/category.repository.port";
import { Category } from "../entities/category.entity";
import { Inject } from "@nestjs/common";

export class GetAllCategoriesUseCase {
    constructor(
        @Inject('CategoryRepositoryPort')
        private readonly categoryRepository: CategoryRepositoryPort
    ) { }

    async execute(): Promise<Category[] | null> {
        return await this.categoryRepository.findAll();
    }
}

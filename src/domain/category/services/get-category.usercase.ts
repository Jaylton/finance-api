import { CategoryRepositoryPort } from "../ports/category.repository.port";
import { Category } from "../entities/category.entity";
import { Inject } from "@nestjs/common";

export class GetCategoryUseCase {
    constructor(
        @Inject('CategoryRepositoryPort')
        private readonly categoryRepository: CategoryRepositoryPort
    ) { }

    async execute(id: string): Promise<Category | null> {
        return await this.categoryRepository.findById(id);
    }
}

import { CategoryRepositoryPort } from "../ports/category.repository.port";
import { Category } from "../entities/category.entity";
import { Inject } from "@nestjs/common";

export class UpdateCategoryUseCase {
    constructor(
        @Inject('CategoryRepositoryPort')
        private readonly categoryRepository: CategoryRepositoryPort,
    ) { }

    async execute(id: string, input: {
        name: string;
    }): Promise<Category> {
        const category = new Category(
            id,
            input.name,
        );
        await this.categoryRepository.update(id, category);
        return category;
    }
}

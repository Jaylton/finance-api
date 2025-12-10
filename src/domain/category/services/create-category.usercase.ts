import { CategoryRepositoryPort } from "../ports/category.repository.port";
import { Category } from "../entities/category.entity";
import { Inject } from "@nestjs/common";

export class CreateCategoryUseCase {
    constructor(
        @Inject('CategoryRepositoryPort')
        private readonly categoryRepository: CategoryRepositoryPort,
    ) { }

    async execute(input: {
        name: string;
    }): Promise<Category> {
        const category = new Category(
            crypto.randomUUID(),
            input.name,
        );
        await this.categoryRepository.create(category);
        return category;
    }
}

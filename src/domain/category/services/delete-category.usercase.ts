import { Inject } from "@nestjs/common";
import { CategoryRepositoryPort } from "../ports/category.repository.port";

export class DeleteCategoryUseCase {
    constructor(
        @Inject('CategoryRepositoryPort')
        private readonly categoryRepository: CategoryRepositoryPort
    ) { }

    async execute(id: string): Promise<void> {
        return await this.categoryRepository.delete(id);
    }
}

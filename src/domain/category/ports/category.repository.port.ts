import { Category } from "../entities/category.entity";

export abstract class CategoryRepositoryPort {
    abstract findAll(): Promise<Category[] | null>;
    abstract findById(id: string): Promise<Category | null>;
    abstract create(category: Category): Promise<void>;
    abstract update(id: string, category: Category): Promise<Category | null>;
    abstract delete(id: string): Promise<void>;
}

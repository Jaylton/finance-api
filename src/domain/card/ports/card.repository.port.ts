import { Card } from "../entities/card.entity";

export abstract class CardRepositoryPort {
    abstract findAll(): Promise<Card[] | null>;
    abstract findById(id: string): Promise<Card | null>;
    abstract create(card: Card): Promise<void>;
    abstract update(id: string, card: Card): Promise<Card | null>;
    abstract delete(id: string): Promise<void>;
}
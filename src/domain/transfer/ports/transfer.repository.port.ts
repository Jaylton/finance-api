import { GraphicResult } from "../dtos/graphic-result";
import { TransferSearchCriteria } from "../dtos/transfer-search-criteria";
import { Transfer } from "../entities/transfer.entity";

export abstract class TransferRepositoryPort {
    abstract findAll(criteria: TransferSearchCriteria): Promise<Transfer[] | null>;
    abstract graphic(criteria: TransferSearchCriteria): Promise<GraphicResult[] | null>;
    abstract findLastByName(name: string): Promise<Transfer | null>;
    abstract findFirstByParams(params: Partial<Transfer>): Promise<Transfer | null>;
    abstract create(transfer: Transfer): Promise<Transfer>;
    abstract update(id: string, transfer: Transfer): Promise<Transfer | null>;
    abstract delete(id: string): Promise<void>;
}
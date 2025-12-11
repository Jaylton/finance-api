export interface TransferSearchCriteria {
  startDate?: Date; // Já tipado como Date
  endDate?: Date;
  type?: string;
  accountId?: string;
  cardId?: string;
  categoryIds?: string[];
}
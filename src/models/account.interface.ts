
export interface Account {
  accountNumber: string;
  expiredDate: string;
  bExported: boolean;
  bDisabled: boolean;
  availableCount: number;
  usedCount: number;
  id: number;
  ownerId: number;
  lastUpdatedById: number;
  createdAt: string;
  updatedAt: string;
}

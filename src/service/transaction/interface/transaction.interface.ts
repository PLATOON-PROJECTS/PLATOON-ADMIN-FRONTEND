export interface Transaction {
  userId: number;
  payrollId: number | null;
  payroll: any | null;
  transactionType: string;
  amount: number;
  description: string;
  sessionId: string;
  referenceNumber: string;
  status: string;
  accountNumber: string;
  currency: string;
  sourceAccountNumber: string;
  sourceAccountName: string;
  sourceBankName: string;
  id: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string | null;
}

export interface TransactionResponse {
  succeeded: boolean;
  message: string;
  data: {
    pageItems: Transaction[];
    currentPage: number;
    numberOfPages: number;
    totalItems: number;
  };
}

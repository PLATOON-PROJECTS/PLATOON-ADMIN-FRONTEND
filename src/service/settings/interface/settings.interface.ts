export interface Update {
  payroll?: {
    frequency: string;
    schedule: Date;
    bonus: {
      day: number;
      month: number;
    };
    pension: number;
  };
  tax?: {
    enabled: boolean;
    percentage: number;
  };
  salary?: {
    breakdown: {
      Basic: number;
      Housing: number;
      Transport: number;
    };
  };
  nhf?: {
    enabled: boolean;
    percentage: number;
  };
  leave_allowance: boolean;
}

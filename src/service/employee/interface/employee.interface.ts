export interface Create {
  firstname: string;
  lastname: string;
  email: string;
  telephone: number;
  active: number;
  group_id: number;
  grade: number;
  account_details: {
    bank: string;
    account_name: string;
    account_number: number;
  };
}
export interface Update {
  firstname?: string;
  lastname?: string;
  email?: string;
  telephone?: number;
  active?: number;
  group_id?: number;
  grade?: number;
  account_details?: {
    bank?: string;
    account_name?: string;
    account_number?: number;
  };
}

export interface Bonus{
  amount:string,
  reason: string,
  type: string
  end_date?: string
}

export interface Deduction{
  amount:string,
  reason: string,
  type: string
  end_date?: string
}
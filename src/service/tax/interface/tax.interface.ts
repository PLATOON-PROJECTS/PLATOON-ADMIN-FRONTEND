export interface Create {
  employee_id: number;
  state: string;
  payee_id: number;
}

export interface UpdateSettings {
  enable?: boolean;
  state?: string;
  pay_id?: string;
}

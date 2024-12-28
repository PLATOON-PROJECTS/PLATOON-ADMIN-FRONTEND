export interface Create {
  month: string;
  group: number;
  employees: [
    {
      id: number;
      payment_extras: {
        bonus: number;
        deductions: number;
        leave_allowance: boolean;
      };
    },
    {
      id: number;
      payment_extras: {
        bonus: number;
        deductions: number;
        leave_allowance: boolean;
      };
    }
  ];
}
export interface Update {
  month?: Date;
  group?: number;
  employees?: [
    {
      id: number;
      payment_extras: {
        bonus: number;
        deductions: number;
        leave_allowance: boolean;
      };
    },
    {
      id: number;
      payment_extras: {
        bonus: number;
        deductions: number;
        leave_allowance: boolean;
      };
    }
  ];
}
export interface UpdateSettings {
  frequency: string;
  scheduled_at: string;
  payroll: {
    bonus: {
      month: string;
      percentage: string;
    };
  };
  leave_bonus: string;
  payroll_pension: string;
  salary_breakdown: any;
}

export interface Payroll {
  payrollId: string;
  totalGrossPay: number;
  totalDeductions: number;
  totalBonus: number;
  totalNetPay: number;
  totalTaxAmount: number;
  totalEmployees: number;
  status: string | null;
  payType: string;
  submissionDate: string | null;
  scheduledDate: string;
}

export interface Payrolll {
  id: number;
  organisationId: number;
  payType: string;
  isSubmitted: boolean;
  submissionDate: string;
  scheduledDate: string;
  status: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string;
}
export interface EmployeeSalary {
  employeeId: number;
  firstName: string;
  lastName: string;
  grossPay: number;
  bonus: Bonus;
  deduction: Deduction;
  taxAmount: number;
  netPay: number;
  payPeriod: string;
}

export interface PayrollData {
  employeeSalaries: EmployeeSalary[];
  payroll: Payrolll;
  statusModifiedDate: string;
  nameOfApprover: string;
  totalSalaries: number;
  totalEmployees: number;
}

export interface GetPayrollResponse {
  succeeded: boolean;
  message: string;
  data: {
    pageItems: PayrollData;
    pageSize: number;
    currentPage: number;
    numberOfPages: number;
    previousPage: number;
  };
  statusCode: number;
}

export interface Bonus {
  id?: number;
  // isActive: boolean;
  // isDeleted: boolean;
  // createdAt: string;
  // modifiedAt: string;
  amount: number;
  reason: string;
}

export interface Deduction {
  id?: number;
  // isActive: boolean;
  // isDeleted: boolean;
  // createdAt: string;
  // modifiedAt: string;
  amount: number;
  reason: string;
}

export interface EmployeePayroll {
    employeeName: string;
    payrollId: number;
    grossPay: number;
    bonus: {
        id?: number;
        amount: number;
        reason: string;
    };
    deduction: {
        id?: number;
        amount: number;
        reason: string;
    };
    taxAmount: number;
    netPay: number;
    payPeriod: string;
    employeeId: number;
}
export interface EmployeesPayroll {
  payrollId: number;
  grossPay: number;
  bonus: {
    amount: number;
  };
  deduction: {
    amount: number;
  };
  taxAmount: number;
  netPay: number;
  // Add any other fields that are returned in the payroll response
}


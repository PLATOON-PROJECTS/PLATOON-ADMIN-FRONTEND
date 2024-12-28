// export interface Create {
//   name: string;
//   grades: any;
//   settings: {
//     tax: boolean;
//     nhf: boolean;
//     pension: boolean;
//   };
// }
// export interface Update {
//   name?: string;
//   grades?: any;
//   settings?: {
//     tax: boolean;
//     nhf: boolean;
//     pension: boolean;
//   };
// }

export interface Grade {
  name: string; 
  code: string; 
  grossPay: number;
}

export interface Create {
  name: string; 
  supportingName?: string;
  grades: Grade[]; 
  settings?: {
    tax: boolean;
    nhf: boolean;
    pension: boolean;
  };
}

export interface Update {
  name?: string; 
  supportingName?: string;
  grades?: Grade[]; 
  settings?: {
    tax: boolean;
    nhf: boolean;
    pension: boolean;
  };
}


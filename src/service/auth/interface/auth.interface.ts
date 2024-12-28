// export interface Register {
//   firstname?: string;
//   lastname?: string;
//   telephone?: number;
//   email: string;
//   password: string;
//   confirmPassword?: string;
//   company?: {
//     name: string;
//     email?: string;
//     telephone?: number;
//     city?: string;
//     country?: string;
//     state?: string;
//     address?: string;
//     currency?: number;
//   };
// }

export interface Register {
  email: string;
  password: string;
  company: string;
  // company?: {
  //   name: string;
  //   email?: string;
  //   telephone?: number;
  //   city?: string;
  //   country?: string;
  //   state?: string;
  //   address?: string;
  //   currency?: number;
  // };
}
export interface Update {
  firstname?: string;
  lastname?: string;
  telephone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  photo?: string;
}
export interface Login {
  email: string;
  password: string;
}
export interface ForgotPasswordInit {
  email: string;
}
export interface ForgotPasswordComplete {
  confirmPassword: string;
  newPassword: string;
  resetToken: string;
}
export interface ResetPassword {
  newPassword: string;
  token: string;
  email: string;
}
export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

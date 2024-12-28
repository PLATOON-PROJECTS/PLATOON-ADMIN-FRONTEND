import { defineStore } from "pinia";

import authService from "../../service/auth/auth.service";
import { storeItem } from "../../core/utils/storage.helper";
import {
  Register,
  Login,
  ForgotPasswordInit,
  ForgotPasswordComplete,
  ChangePassword,
  ResetPassword,
  Update,
} from "../../service/auth/interface/auth.interface";
import isAuthenticated from "../../core/helpers/authenticate";
import isAuthenticateed from "../../core/helpers/authenticated";
import userService from "../../service/user/user.service";

const isIdentity = isAuthenticated();
const isIdentityy = isAuthenticateed();

const authStore = defineStore("auth", {
  state: () => {
    return {
      isAuthenticated: isIdentity,
      isAuthenticateed: isIdentityy,
      customerReg: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      userLogin: {
        email: "",
      },
      successMessage: null,
      errorMessage: null,
    };
  },
  actions: {
    // async userLogin(data: Login): Promise<any> {
    //   try {
    //     const response = await authService.login(data);

    //     if (response && response.data && response.data.access_token) {
    //       // console.log(response.data);
      
    //       storeItem(import.meta.env.VITE_ACCESSTK, {
    //         rsa: response.data.access_token,
    //       });

    //       const data = JSON.stringify({
    //         customerInfo: {
    //           firstName: response.data.data.firstname,
    //           lastName: response.data.data.lastname,
    //           email: response.data.data.email,
    //           phone: response.data.data.phone,
    //         },
    //       });

    //       storeItem(import.meta.env.VITE_USERDETAILS, data);
    //       this.isAuthenticated = true;

    //       return await Promise.resolve(response);
    //     } else if (response.response) {
    //       return await Promise.reject(response.response);
    //     } else {
    //       return await Promise.reject(response.message);
    //     }
    //   } catch (error: any) {
    //     // console.log(error);
    //     return await Promise.reject(error);
    //   }
    // },

    // async userLoginn(data: Login): Promise<any> {
    //   try {
    //     const response = await authService.loginn(data);

    //     if (response && response.data && response.data.data.token) {
    //       // console.log(response.data.data.token);
    //       console.log("____________",response.data.data.email);
      
    //       storeItem(import.meta.env.VITE_ACCESSTOKEN, {
    //         rsa: response.data.data.token,
    //       });

    //       const data = JSON.stringify({
    //         customerInfo: {
    //           email: response.data.data.email,
    //         },
    //       });

    //       storeItem(import.meta.env.VITE_USERDETAILS, data);
    //       this.isAuthenticateed = true;

    //       return await Promise.resolve(response);
    //     } else if (response.response) {
    //       return await Promise.reject(response.response);
    //     } else {
    //       return await Promise.reject(response.message);
    //     }
    //   } catch (error: any) {
    //     // console.log(error);
    //     return await Promise.reject(error);
    //   }
    // },
    async userLoginn(data: Login): Promise<any> {
      try {
        const response = await authService.loginn(data);
    
        if (response && response.data && response.data.data.token) {
          const token = response.data.data.token;
          const userId = response.data.data.id; // Assuming you have an ID in the response
    
          storeItem(import.meta.env.VITE_ACCESSTOKEN, { rsa: token });
    
          // Fetch additional user details
          const userDetailsResponse = await userService.show(userId);
          
          // Handle the user details response
          if (userDetailsResponse && userDetailsResponse.data) {
            console.log("////////////", userDetailsResponse.data)
            // Store user details in local storage or state
            const userData = JSON.stringify({
              customerInfo: {
                firstName: userDetailsResponse.data.data.organisation.user.firstname,
                lastName: userDetailsResponse.data.data.organisation.user.lastname,
                email: userDetailsResponse.data.data.organisation.user.email,
                phone: userDetailsResponse.data.data.organisation.user.phone,
                // wallet: userDetailsResponse.data.data.organisation.wallet.balance,
                organisationName: userDetailsResponse.data.data.organisation.organisationName,
                organisationId: userDetailsResponse.data.data.organisation.id,
              },
            });
    
            storeItem(import.meta.env.VITE_USERDETAILS, userData);
          }
    
          this.isAuthenticateed = true;
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    
    // async userRegister(data: Register): Promise<any> {
    //   try {
    //     const response = await authService.register(data);
    //     if (response.data) {
    //       return await Promise.resolve(response);
    //     } else if (response.response) {
    //       return await Promise.reject(response.response);
    //     } else {
    //       return await Promise.reject(response.message);
    //     }
    //   } catch (error: any) {
    //     return await Promise.reject(error);
    //   }
    // },
    async userRegister(data: Register): Promise<any> {
      try {
        const response = await authService.register(data);
        if (response.data) {
          // Send email confirmation link
          await this.sendEmailConfirmationLink(data.email);
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    
    async sendEmailConfirmationLink(email: string): Promise<any> {
      try {
        const response = await authService.sendEmailConfirmationLink({ email });
        return await Promise.resolve(response);
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },    
    async userForgotPasswordInit(email: string): Promise<any> {
      try {
        const response = await authService.forgotPasswordInit(email);

        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        // console.log("error:", error);
        return await Promise.reject(error);
      }
    },
    async signInWithGoogle(tke: string,response:any): Promise<any> {
      storeItem(import.meta.env.VITE_ACCESSTK, {
        rsa: tke,
      });

      const data = {
        customerInfo: {
          firstName: response.data.data.firstname,
          lastName: response.data.data.lastname,
          email: response.data.data.email,
          phone: response.data.data.phone,
        },
      };

      storeItem(import.meta.env.VITE_USERDETAILS, data);
      this.isAuthenticated = true;

    },
    async forgotPasswordComplete(data: any): Promise<any> {
      try {
        const response = await authService.forgotPasswordComplete(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error) {
        return await Promise.reject(error);
      }
    },
    async userResetPassword(data: ResetPassword): Promise<any> {
      try {
        const response = await authService.resetPassword(data);

        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async confirmEmail(data: { email: string; token: string }): Promise<any> {
      try {
        const response = await authService.confirmEmail(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async registerEmployee(data: { inviteId: string; password: string }): Promise<any> {
      try {
        const response = await authService.registerEmployee(data);

        if (response && response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async changePassword(data: any): Promise<any> {
      try {
        const response = await authService.changePassword(data);
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async logoutUser(): Promise<any> {
      try {
        const response = await authService.logout();
        if (response && response.status === 200) {
          this.isAuthenticateed = false;
          sessionStorage.clear();
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async getProfile(): Promise<any> {
      try {
        const response = await authService.profile();
        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
   
    async updateProfile(data: Update): Promise<any> {
      try {
        const response = await authService.updateProfile(data);

        if (response.data) {
          return await Promise.resolve(response);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
  },
});

export default authStore;




















// import { defineStore } from "pinia";

// import authService from "../../service/auth/auth.service";
// import { storeItem } from "../../core/utils/storage.helper";
// import {
//   Register,
//   Login,
//   ForgotPasswordInit,
//   ForgotPasswordComplete,
//   ChangePassword,
//   Update,
// } from "../../service/auth/interface/auth.interface";
// import isAuthenticated from "../../core/helpers/authenticate";

// const isIdentity = isAuthenticated();

// const authStore = defineStore("auth", {
//   state: () => {
//     return {
//       isAuthenticated: isIdentity,
//       customerReg: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//       },
//       userLogin: {
//         email: "",
//       },
//       successMessage: null,
//       errorMessage: null,
//     };
//   },
//   actions: {
//     async userLogin(data: Login): Promise<any> {
//       try {
//         const response = await authService.login(data);

//         if (response && response.data && response.data.access_token) {
//           // console.log(response.data);
      
//           storeItem(import.meta.env.VITE_ACCESSTK, {
//             rsa: response.data.access_token,
//           });

//           const data = JSON.stringify({
//             customerInfo: {
//               firstName: response.data.data.firstname,
//               lastName: response.data.data.lastname,
//               email: response.data.data.email,
//               phone: response.data.data.phone,
//             },
//           });

//           storeItem(import.meta.env.VITE_USERDETAILS, data);
//           this.isAuthenticated = true;

//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error: any) {
//         // console.log(error);
//         return await Promise.reject(error);
//       }
//     },
//     async userRegister(data: Register): Promise<any> {
//       try {
//         const response = await authService.register(data);
//         if (response.data) {
//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error: any) {
//         return await Promise.reject(error);
//       }
//     },
//     async userForgotPasswordInit(data: ForgotPasswordInit): Promise<any> {
//       try {
//         const response = await authService.forgotPasswordInit(data);

//         if (response.data) {
//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error: any) {
//         // console.log("error:", error);
//         return await Promise.reject(error);
//       }
//     },
//     async signInWithGoogle(tke: string,response:any): Promise<any> {
//       storeItem(import.meta.env.VITE_ACCESSTK, {
//         rsa: tke,
//       });

//       const data = JSON.stringify({
//         customerInfo: {
//           firstName: response.data.data.firstname,
//           lastName: response.data.data.lastname,
//           email: response.data.data.email,
//           phone: response.data.data.phone,
//         },
//       });

//       storeItem(import.meta.env.VITE_USERDETAILS, data);
//       this.isAuthenticated = true;

//     },
//     async forgotPasswordComplete(data: any): Promise<any> {
//       try {
//         const response = await authService.forgotPasswordComplete(data);
//         if (response.data) {
//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error) {
//         return await Promise.reject(error);
//       }
//     },
//     async changePassword(data: any): Promise<any> {
//       try {
//         const response = await authService.changePassword(data);
//         if (response.data) {
//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error: any) {
//         return await Promise.reject(error);
//       }
//     },

//     async logoutUser(): Promise<any> {
//       try {
//         const response = await authService.logout();
//         if (response.data) {
//           this.isAuthenticated = false;
//           sessionStorage.clear();
//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error: any) {
//         return await Promise.reject(error);
//       }
//     },
//     async getProfile(): Promise<any> {
//       try {
//         const response = await authService.profile();
//         if (response.data) {
//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error: any) {
//         return await Promise.reject(error);
//       }
//     },
//     async updateProfile(data: Update): Promise<any> {
//       try {
//         const response = await authService.updateProfile(data);

//         if (response.data) {
//           return await Promise.resolve(response);
//         } else if (response.response) {
//           return await Promise.reject(response.response);
//         } else {
//           return await Promise.reject(response.message);
//         }
//       } catch (error: any) {
//         return await Promise.reject(error);
//       }
//     },
//   },
// });

// export default authStore;

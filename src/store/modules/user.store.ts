import { defineStore } from "pinia";

import { Create, Update } from "../../service/user/interface/user.interface";
import userService from "../../service/user/user.service";
import { storeItem } from "../../core/utils/storage.helper";

interface State {
  error: { value: boolean; type: any | null; message: string | null };
}
const userStore = defineStore("user", {
  state: (): State => ({
    error: { value: false, type: null, message: null },
  }),

  actions: {
    // async show(id: string): Promise<any> {
    //   try {
    //     const response = await userService.show(id);
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

    async show(userId: number): Promise<any> {
      try {
        const response = await userService.show(userId);
        if (response && response.data && response.data.data) {
          console.log(
            "_____\\\\\\\\_____",
            response.data.data.organisation.user.email
          );
          console.log("_____----_____", response.data.data);

          const data = JSON.stringify({
            customerInfo: {
              firstName: response.data.data.organisation.user.firstname,
              lastName: response.data.data.organisation.user.lastname,
              email: response.data.data.organisation.user.email,
              phone: response.data.data.organisation.user.email,
              // wallet: response.data.data.organisation.wallet.balance,
              organisationName:
                response.data.data.organisation.organisationName,
              organisationId: response.data.data.organisation.id,
              userId: response.data.data.organisation.userId,
            },
          });
          storeItem(import.meta.env.VITE_USERDETAILS, data);
          console.log("^^^^", data);
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
    async verify(verify: string): Promise<any> {
      try {
        const response = await userService.verify(verify);
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
    // async getUsers(): Promise<any> {
    //   try {
    //     const response = await userService.getUsers();
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

    async getUsers(
      organisationId: number,
      pageSize: number,
      pageNumber: number
    ): Promise<any> {
      try {
        const response = await userService.getUsers(
          organisationId,
          pageSize,
          pageNumber
        );
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

    async getUserRole(userId: number): Promise<any> {
      try {
        const response = await userService.getUserRoleById(userId);
        console.log("Response from service:", response);
        if (response.succeeded) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error: any) {
        console.error("Error in getUserRole:", error);
        throw error;
      }
    },
    async fetchRoles(): Promise<any> {
      try {
        const response = await userService.fetchRoles();
        if (response.data) {
          return await Promise.resolve(response.data.data);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },

    async assignRole(userId: number, roleId: number): Promise<any> {
      try {
        const response = await userService.assignRole({ userId, roleId });
        console.log("Responseeeeeeee:", response);
        if (response.data) {
          return await Promise.resolve(response.data);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async updateRole(userId: number, roleId: number): Promise<any> {
      try {
        const response = await userService.updateRole(userId, roleId);
        if (response.data) {
          return await Promise.resolve(response.data);
        } else if (response.response) {
          return await Promise.reject(response.response);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async deleteUser(userId: string): Promise<any> {
      try {
        const response = await userService.deleteUser(userId);
        if (response.data) {
          return await Promise.resolve(response.data);
        } else {
          return await Promise.reject(response.message);
        }
      } catch (error: any) {
        return await Promise.reject(error);
      }
    },
    async create(data: Create): Promise<any> {
      try {
        const response = await userService.create(data);
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
    async update(data: Update, id: string): Promise<any> {
      try {
        const response = await userService.update(data, id);
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
    async delete(id: string): Promise<any> {
      try {
        const response = await userService.delete(id);
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
    async updateUserImage(userId: number, formData: FormData): Promise<any> {
      try {
        const response = await userService.updateUserImage(userId, formData);
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

export default userStore;

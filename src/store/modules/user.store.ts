import { defineStore } from "pinia";

import { Create, Update } from "../../service/user/interface/user.interface";
import userService from "../../service/user/user.service";
import { storeItem } from "../../core/utils/storage.helper";
import { ref } from "vue";

interface State {
  error: { value: boolean; type: any | null; message: string | null };
  profilePhotoUrl: string | null; // add it to state!
  userFirstName: string | null;
  userLastName: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): State => ({
    error: { value: false, type: null, message: null },
    profilePhotoUrl: null,
    userFirstName: null,
    userLastName: null,
  }),

  getters: {
    userInitials: (state) => {
      if (!state.userFirstName && !state.userLastName) return null;
      const firstInitial = state.userFirstName?.charAt(0).toUpperCase() || "";
      const lastInitial = state.userLastName?.charAt(0).toUpperCase() || "";
      return `${firstInitial}${lastInitial}`;
    },
  },

  actions: {
    async show(userId: number): Promise<any> {
      try {
        const response = await userService.show(userId);
        if (response && response.data && response.data.data) {
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
    async fetchAdmin(id: number): Promise<any> {
      try {
        const response = await userService.fetchAdmin(id);
        if (response && response.data && response.data.data) {
          const data = JSON.stringify({
            customerInfo: {
              firstName: response.data.data.organisation.user.firstname,
              lastName: response.data.data.organisation.user.lastname,
              email: response.data.data.organisation.user.email,
              phone: response.data.data.organisation.user.email,
              // wallet: response.data.data.organisation.wallet.balance,
              id: response.data.data.organisation.id,
            },
          });
          storeItem(import.meta.env.VITE_USERDETAILS, data);
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

    async fetchUserProfilePhoto(userId: number) {
      try {
        console.log("🔍 Fetching profile photo for userId:", userId);

        // Try both endpoints to get user profile data
        let result = null;

        try {
          // First try the getUserProfile endpoint
          result = await userService.getUserProfile(userId);
          console.log("📡 getUserProfile result:", result);
        } catch (error) {
          console.log("⚠️ getUserProfile failed, trying show endpoint");
          // Fallback to show endpoint
          result = await userService.show(userId);
          console.log("📡 show result:", result);
        }

        // Check different possible response structures
        let imageUrl = null;
        let firstName = null;
        let lastName = null;

        if (result?.succeeded && result.data?.employee?.user) {
          // Structure from getUserProfile: result.data.employee.user
          const user = result.data.employee.user;
          imageUrl = user.imageUrl;
          firstName = user.firstname || user.firstName;
          lastName = user.lastname || user.lastName;
        } else if (
          result?.data?.succeeded &&
          result.data?.data?.organisation?.user
        ) {
          // Structure: result.data.data.organisation.user
          const user = result.data.data.organisation.user;
          imageUrl = user.imageUrl;
          firstName = user.firstname || user.firstName;
          lastName = user.lastname || user.lastName;
        } else if (result?.data?.data?.employee?.user) {
          // Structure: result.data.data.employee.user
          const user = result.data.data.employee.user;
          imageUrl = user.imageUrl;
          firstName = user.firstname || user.firstName;
          lastName = user.lastname || user.lastName;
        } else if (result?.data?.data?.user) {
          // Structure: result.data.data.user
          const user = result.data.data.user;
          imageUrl = user.imageUrl;
          firstName = user.firstname || user.firstName;
          lastName = user.lastname || user.lastName;
        } else if (result?.data?.data?.imageUrl) {
          // Structure: result.data.data.imageUrl
          imageUrl = result.data.data.imageUrl;
        } else if (result?.data?.imageUrl) {
          // Direct structure: result.data.imageUrl
          imageUrl = result.data.imageUrl;
        }

        // Update user names
        this.userFirstName = firstName;
        this.userLastName = lastName;
        console.log("👤 User names set:", { firstName, lastName });

        if (imageUrl) {
          // Add cache-busting timestamp to prevent browser caching issues
          this.profilePhotoUrl = imageUrl.includes("?")
            ? `${imageUrl}&t=${Date.now()}`
            : `${imageUrl}?t=${Date.now()}`;
          console.log("✅ Profile photo URL set to:", this.profilePhotoUrl);
        } else {
          console.log("❌ No image URL found in response, setting to null");
          console.log(
            "📋 Full response structure:",
            JSON.stringify(result, null, 2)
          );
          this.profilePhotoUrl = null;
        }
      } catch (error) {
        console.error("💥 Failed to fetch profile photo:", error);
        this.profilePhotoUrl = null;
      }
    },

    updateProfilePhotoUrl(imageUrl: string) {
      console.log("🔄 Updating profile photo URL:", imageUrl);
      // Add cache-busting timestamp to prevent browser caching issues
      this.profilePhotoUrl = imageUrl.includes("?")
        ? `${imageUrl}&t=${Date.now()}`
        : `${imageUrl}?t=${Date.now()}`;
      console.log("✅ Profile photo URL updated to:", this.profilePhotoUrl);
    },

    async uploadPassport(file: File, userId: number) {
      try {
        const response = await userService.uploadPassport(file, userId);
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

export default useUserStore;

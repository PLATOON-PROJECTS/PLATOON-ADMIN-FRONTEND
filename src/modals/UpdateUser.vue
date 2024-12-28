<script setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { IClose } from "../core/icons";
import { IArrowDown } from "../core/icons";
import { useUserStore } from "../store";

const openUpdateUser = inject<Ref<boolean>>("openUpdateUser", ref(false));
const userId = ref<number | null>(null);
const userStore = useUserStore();
const userRoleData = ref<any>(null);
const selectedRole = ref("");
const showRoleDropdown = ref(false);
const loading = ref(false);
const roles = ref<any[]>([]);
const props = defineProps({
  fetchUsers: {
    type: Function,
    required: true,
  },
});

const fetchUserRole = async (userId: number) => {
  try {
    const roleData = await userStore.getUserRole(userId);
    console.log("Fetched role data:", roleData);
    if (roleData) {
      userRoleData.value = roleData;
      console.log("Fetched role data:", userRoleData.value);
      console.log("User Firstname:", userRoleData.value.user.firstname);
      console.log("User Lastname:", userRoleData.value.user.lastname);
      console.log("User Role:", userRoleData.value.roleId);
      const userRoleId = userRoleData.value.roleId;
      const fetchedRole = roles.value.find((role) => role.id === userRoleId);
      selectedRole.value = fetchedRole ? fetchedRole.name : "";
    } else {
      console.error("No role data returned");
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
};

const fetchRoles = async () => {
  loading.value = true;
  try {
    const response = await userStore.fetchRoles();
    console.log("0000", response);
    roles.value = response;
    console.log("(((((((", roles.value);
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

onMounted(() => {
  const storedUserId = localStorage.getItem("selectedUserId");
  console.log("====", storedUserId);
  if (storedUserId) {
    userId.value = JSON.parse(storedUserId);
    if (userId.value !== null) {
      fetchUserRole(userId.value);
    } else {
      console.error("User ID is null");
    }
    fetchRoles();
  }
});
const selectRole = (role: any) => {
  selectedRole.value = `${role.name}`;
  showRoleDropdown.value = false;
};

const saveChanges = async () => {
  if (userId.value !== null && selectedRole.value) {
    const roleToUpdate = roles.value.find(
      (role) => role.name === selectedRole.value
    );
    if (roleToUpdate) {
      try {
        console.log("Sending data:", {
          userId: userId.value,
          roleId: roleToUpdate.id,
        });
        await userStore.updateRole(userId.value, roleToUpdate.id);
        console.log("Role updated successfully");
        localStorage.removeItem("selectedUserId");
        openUpdateUser.value = false;
        props.fetchUsers();
      } catch (error) {
        console.error("Error updating role:", error);
      }
    } else {
      console.error("Selected role not found");
    }
  } else {
    console.error("User ID is null or no role selected");
  }
};

// const fetchData = async () => {
//   if (userId.value !== null) {
//     await Promise.all([fetchUserRole(userId.value), fetchRoles()]);
//   } else {
//     console.error("User ID is null, cannot fetch user role.");
//   }
// };

// onMounted(() => {
//   const storedUserId = localStorage.getItem("selectedUserId");
//   if (storedUserId) {
//     userId.value = JSON.parse(storedUserId);
//     fetchData(); // Call the fetch function
//   }
// });
</script>

<template>
  <Transition
    name="edit-pension-modal"
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight"
    :duration="400"
  >
    <div class="w-screen z-50 bg-[#000000A3] min-h-screen h-full fixed">
      <div class="flex justify-center">
        <div
          class="lg:p-9 p-5 lg:w-1/3 rounded-lg inline-block align-middle bg-white lg:mt-24 mt-10 space-y-12"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-black-rgba font-medium text-2xl">
                {{
                  userRoleData
                    ? `${userRoleData.user.firstname} ${userRoleData.user.lastname}`
                    : " "
                }}
              </h3>
              <span class="text-sm font-semimedium text-black-rgba-100"
                >Edit details</span
              >
            </div>
            <button
              @click="openUpdateUser = false"
              class="bg-blue-lighter rounded-full top-12 right-12 p-3"
            >
              <IClose />
            </button>
          </div>
          <!--  -->
          <div class="space-y-6">
            <div
              class="font-normal text-left rounded-xl px-4 py-4 relative border text-black"
            >
              <p
                class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white"
              >
                First name
              </p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-black">{{
                  userRoleData ? userRoleData.user.firstname : " "
                }}</span>
              </div>
            </div>
            <!--  -->

            <div
              class="font-normal text-left rounded-xl px-4 py-4 relative border text-black"
            >
              <p
                class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white"
              >
                Last name
              </p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-black">{{
                  userRoleData ? userRoleData.user.lastname : " "
                }}</span>
              </div>
            </div>
            <!--  -->

            <div
              class="font-normal relative w-auto text-left rounded-xl px-4 h-[48px] text-gray-rgba-3 border text-black"
            >
              <div class="flex justify-between items-center h-full">
                <input
                  @click="
                    showRoleDropdown = !showRoleDropdown;
                    if (!roles.length) fetchRoles();
                  "
                  type="text"
                  v-model="selectedRole"
                  class="text-sm text-black w-full border-none outline-none focus:outline-none"
                  placeholder="Select access role"
                />
                <span>
                  <IArrowDown @click="showRoleDropdown = !showRoleDropdown" />
                </span>
              </div>
              <div
                class="absolute z-50 h-56 right-0 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                v-if="showRoleDropdown == true"
              >
                <div
                  class="space-y-5 p-6 text-[#626669A3] bg-white text-sm rounded-lg w-auto max-h-min"
                >
                  <div v-if="roles.length > 0">
                    <div v-for="role in roles" :key="role.id">
                      <p
                        @click="selectRole(role)"
                        class="cursor-pointer mb-4 hover-black"
                      >
                        {{ role.name }}
                      </p>
                    </div>
                  </div>
                </div>
                <!--  -->
              </div>
            </div>
          </div>
          <div class="flex pb-5">
            <ButtonBlue @click="saveChanges" :disabled="loading">
              <template v-slot:placeholder>Save Changes</template>
            </ButtonBlue>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

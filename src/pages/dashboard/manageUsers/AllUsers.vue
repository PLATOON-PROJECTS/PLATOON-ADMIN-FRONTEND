<script setup lang="ts">
import { inject, ref } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import ButtonColorless from "../../../components/buttons/ButtonColorless.vue";
import { IIncDec, IArrowDown, IUserThree } from "../../../core/icons";
import confirmAlert from "../../../components/alerts/ConfirmAlert.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import { useUserStore } from "../../../store/index";
import cache from "../../../composables/swr_cache";
import { getItem } from "../../../core/utils/storage.helper";
import Pagination from "../../../components/Pagination.vue";
import { Ref } from "vue";

const router = useRouter();

// initialize store
const userStore = useUserStore();

// variables

const confirmMessage = ref({ message: "", id: "" });
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const showSuccess = ref(false);
const showConfirm = ref(false);
const loading = ref(false);
const responseData = ref<any>({ data: [], message: "" });
const successMessage = ref("Action successful");

// methods
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo =
  typeof userInfo.value === "string"
    ? JSON.parse(userInfo.value)
    : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

const selectedUserId = ref<number | null>(null);
const openUpdateUser = inject<Ref<boolean>>("openUpdateUser", ref(false));

const openUpdateUserModal = (userId: number) => {
  selectedUserId.value = userId;
  localStorage.setItem("selectedUserId", JSON.stringify(userId));
  openUpdateUser.value = true;
};

const fetchUsers = async (page: number) => {
  loading.value = true;
  try {
    const response = await userStore.getUsers(
      organisationId,
      pageSize.value,
      page
    );
    if (response.data) {
      responseData.value.data = response.data.data.pageItems;
      currentPage.value = response.data.data.currentPage;
      totalPages.value = response.data.data.numberOfPages;
      totalItems.value = response.data.data.pageSize * totalPages.value;
    }
  } catch (error) {
    handleError(error, "Error fetching users");
  } finally {
    loading.value = false;
  }
};
// fetchUsers();

const removeUser = async (id: string) => {
  loading.value = true;

  try {
    const response = await userStore.deleteUser(id);
    if (response) {
      responseData.value = responseData.value.filter(
        (data: any) => data.id !== id
      );
      successMessage.value = `User was successfully deleted`;
    }
  } catch (error) {
    handleError(error, "Error deleting user");
  } finally {
    loading.value = false;
  }
};

const confirmRemoveUser = (id: string) => {
  confirmMessage.value.message = `Do you really want to delete this user `;
  confirmMessage.value.id = id;
  showConfirm.value = true;
};
defineExpose({ fetchUsers, loading, responseData, handleSuccess });

fetchUsers(currentPage.value);
const updatePage = (page: number) => {
  fetchUsers(page);
};
</script>
<template>
  <div>
    <!-- confirm alert -->
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>

      <template #confirm
        ><span @click="[removeUser(confirmMessage.id), (showConfirm = false)]"
          >CONFIRM</span
        ></template
      >
      <template #message> {{ confirmMessage.message }}</template>
    </confirmAlert>

    <!-- successAlert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >
    <spinner
      v-if="loading == true"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />
    <div v-else>
      <div
        class="space-y-10 overflow-auto scrollbar-hide"
        v-if="responseData.data[0]"
      >
        <!-- table -->
        <div class="">
          <div class="py-6">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <table class="min-w-full table-fixed">
                  <thead class="text-black-200 text-sm text-left">
                    <tr class="whitespace-nowrap">
                      <th
                        scope="col"
                        class="py-4 text-left flex items-center space-x-3"
                      >
                        <!-- <CheckBox customClasses="indeterminate-check" /> -->
                        <span> Name </span>
                      </th>
                      <th scope=" col" class="py-4 text-left">Email</th>
                      <th scope="col" class="py-4 text-left">Phone Number</th>
                      <th scope="col" class="py-4 text-left">Role</th>
                      <th scope="col" class="py-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-grey-200">
                    <tr
                      v-for="(user, index) in responseData && responseData.data"
                      :key="user.emailAddress"
                      class="text-black-100"
                    >
                      <td class="py-6 whitespace-nowrap w-[25%]">
                        <div class="">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium"
                              >{{ user.firstname }} {{ user.lastname }}</span
                            >
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap w-[30%]">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium">{{
                            user.emailAddress
                          }}</span>
                        </div>
                      </td>
                      <td class="whitespace-nowrap w-[25%]">
                        <div class="font-normal text-left flex">
                          <span class="text-sm font-semimedium">{{
                            user.phoneNumber
                          }}</span>
                        </div>
                      </td>
                      <td class="whitespace-nowrap w-[15%]">
                        <div class="font-normal text-left flex">
                          <span class="text-sm font-semimedium">{{
                            user.role
                          }}</span>
                        </div>
                      </td>
                      <td class="whitespace-nowrap flex space-x-3 mt-3">
                        <div class="font-normal flex text-left">
                          <ButtonLightBlue
                            @click="openUpdateUserModal(user.userId)"
                          >
                            <template v-slot:placeholder>Edit Role</template>
                          </ButtonLightBlue>
                        </div>
                        <div class="font-normal flex text-left">
                          <ButtonLightBlue
                            textColor="text-red"
                            @click="confirmRemoveUser(user.userId)"
                          >
                            <template v-slot:placeholder>Remove</template>
                          </ButtonLightBlue>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- end of table -->
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :pageSize="pageSize"
          :totalItems="totalItems"
          @updatePage="updatePage"
        />
      </div>
      <!-- empty state below -->
      <div class="w-full no-hover flex justify-center" v-else>
        <EmptyState>
          <template #icon>
            <IUserThree />
          </template>
          <template #heading> Users</template>
          <template #desc>
            All users will be displayed here. Click on the “add user”
            <br />
            to start managing users
          </template>
          <template #actions>
            <button
              @click="$emit('showAddUser')"
              class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
            >
              + Add User
            </button>
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>

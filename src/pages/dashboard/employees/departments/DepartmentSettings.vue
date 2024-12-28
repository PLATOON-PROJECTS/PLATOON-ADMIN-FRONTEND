<script setup lang="ts">
import spinner from "../../../../components/timer/Spinner.vue";
import { ref, reactive, computed, inject } from "vue";
import { IArrowDown } from "../../../../core/icons";
import ButtonLightBlue from "../../../../components/buttons/ButtonLightBlue.vue";
import ButtonBlue from "../../../../components/buttons/ButtonBlue.vue";
import { useRoute, useRouter } from "vue-router";
import SuccessAlert from "../../../../components/alerts/SuccessAlert.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import { useGroupStore, useUserStore } from "../../../../store/index";
import { Update } from "../../../../service/group/interface/group.interface";
// initialize route and router
const route = useRoute();
const router = useRouter();
// computed
const groupId = computed(() => {
  return route.params.id as string;
});

// initialize store
const groupStore = useGroupStore();
const userStore = useUserStore();

// variables
const showSuccess = ref(false);
const loading = ref(false);
const updateLoading = ref(false);
const deleteLoading = ref(false);
const fetchLoading = ref(false);
let data = ref<Update>({ name: "" });
const disabled = ref(true);
const errorResponse = ref("");
const responseData = ref<any>({ message: "Action successful" });

// provide and inject
const render = inject<any>("render");

// methods

const updateGroup = async () => {
  // check if form is formattted correctly
  loading.value = true;
  const response = await request(
    groupStore.update(data.value as Update, groupId.value),
    updateLoading
  );

  handleError(response, userStore);
  const successResponse = handleSuccess(response, showSuccess);

  if (successResponse && typeof successResponse !== "undefined") {
    responseData.value.message = successResponse.message;
    getGroup();
  }
};

const getGroup = async () => {
  const response = await request(groupStore.show(groupId.value), fetchLoading);

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    data.value = successResponse.data.data;
  } else {
    errorResponse.value = response.data.message;
  }
};

const deleteGroup = async () => {
  // console.log(groupId.value);
  const response = await request(
    groupStore.delete(groupId.value),
    deleteLoading
  );

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    render.value = true;
    router.push("/dashboard/employees/departments");
  } else {
    errorResponse.value = response.data.message;
  }
};

const saveChanges = async () => {
  await updateGroup();
};
getGroup();

// define expose
defineExpose({
  saveChanges,
  disabled,
});
</script>
<template>
  <div class="sm:flex">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >

    <div class="flex-1 space-y-12">
      <div class="">
        <div class="space-y-1">
          <p class="text-base font-medium">Department name</p>
          <p class="text-sm text-gray-rgba-3">
            Make changes to this department name
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <form @submit.prevent="updateGroup" action="" class="space-y-8">
          <div class="grid lg:grid-cols-2 gap-4">
            <div class="relative">
              <input
                type="text"
                @click="disabled = false"
                id="department"
                v-model="data.name"
                maxlength="55"
                class="input-float peer pr-10.5"
              />
              <label
                for="department"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Rename Department</label
              >
            </div>
          </div>

          <button
            :class="disabled == true ? 'disabled:opacity-75' : ' '"
            :disabled="disabled"
            class="flex items-center cursor-pointer space-x-2.5 bg-[#003b3d] p-3 text-white rounded-full px-10 flex-shrink-0 text-center"
          >
            <spinner v-if="updateLoading == true" />
            <span v-else>Save Changes</span>
          </button>
        </form>
        <!--  -->
        <div class="space-y-8">
          <div class="space-y-1">
            <p class="text-base font-medium">Delete Department</p>
            <p class="text-sm text-gray-rgba-3">
              All group settings and employees would be lost once you delete
              group
            </p>
          </div>

          <div class="flex">
            <ButtonLightBlue
              textColor="text-red px-8 py-1"
              @click="deleteGroup()"
            >
              <template v-slot:placeholder>
                <spinner v-if="deleteLoading == true" />
                <span v-else>Delete Department</span></template
              >
            </ButtonLightBlue>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1"></div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonLightBlue from "../../../../components/buttons/ButtonLightBlue.vue";
import SuccessAlert from "../../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../../components/timer/Spinner.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import { usePensionStore, useUserStore } from "../../../../store/index";

// initialize store
const pensionStore = usePensionStore();
const userStore = useUserStore();

const loading = ref(false);

const showSuccess = ref(false);
const responseData = ref<any>();
const showDeduction = ref(false);
const deductions = ref(["8%", "25%", "50%"]);
const dataObj = ref<{ enable: boolean; pencom_no: string; deduction: string }>({
  enable: true,
  pencom_no: "",
  deduction: "",
});

// methods

const setDeduction = (deduction: string) => {
  dataObj.value.deduction = deduction;
};

const saveChanges = async () => {
  if (dataObj.value.pencom_no !== "" && dataObj.value.deduction !== "") {
    loading.value = true;

    const response = await request(
      pensionStore.settings(dataObj.value),
      loading
    );

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(successResponse.data);
      responseData.value = successResponse;
    }
  }
};
</script>

<template>
  <div class="lg:flex pt-6">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div class="flex-1">
      <div class="lg:w-[75%]">
        <div class="space-y-1">
          <p class="text-base font-medium">Configure salary breakdown</p>
          <p class="text-sm text-gray-rgba-3">
            This allows you to breakdown your employees salaries (e.g basic,
            housing, transport, etc). You can add custom items too.
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="grid sm:grid-cols-2 pt-7 gap-4">
          <div class="relative">
            <input
              type="text"
              id="Name"
              required
              v-model="dataObj.pencom_no"
              maxlength="55"
              class="input-float peer pr-10.5"
              placeholder=""
            />
            <label
              for="Name"
              class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
            >
              Pencom_no</label
            >
          </div>

          <div
            @click="showDeduction = !showDeduction"
            class="relative cursor-pointer font-normal items-center py-3 text-left rounded-lg px-2 border flex justify-between"
          >
            <input
              type="text"
              required
              v-model="dataObj.deduction"
              id="deduction"
              class="rounded-lg text-black text-sm outline-none border-none focus:outline-none focus:border-none"
              placeholder="0.0"
            />
            <span>%</span>
            <label
              for="deduction"
              class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
            >
              Deduction</label
            >

            <div
              v-if="showDeduction == true"
              class="absolute w-full z-50 h-20 scrollbar-hide overflow-auto top-14 space-y-2 p-6 shadow-xl bg-white text-sm cursor-pointer font-bold rounded-lg"
            >
              <p
                class="w-full"
                v-for="(deduction, index) in deductions"
                :key="index"
              >
                <span
                  @click="[setDeduction(deduction), (showDeduction = false)]"
                  >{{ deduction }}</span
                >
              </p>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="flex">
          <ButtonLightBlue @click="saveChanges">
            <template v-slot:placeholder>
              <spinner v-if="loading == true" />
              <span v-else>Submit</span>
            </template>
          </ButtonLightBlue>
        </div>
      </div>
    </div>
    <div class="flex-1 w-full"></div>
  </div>
</template>

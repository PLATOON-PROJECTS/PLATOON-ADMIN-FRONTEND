<script lang="ts" setup>
import { ref, provide } from "vue";
import { IArrowDown } from "../../../../core/icons";
import SuccessAlert from "../../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../../components/timer/Spinner.vue";
import ButtonLightBlue from "../../../../components/buttons/ButtonLightBlue.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import { useTaxStore, useUserStore } from "../../../../store/index";
import State from "../../../../components/dropdowns/states.vue";
import { State as StateEnum } from "../../../../interface/enums.interface";

// initialize store
const taxStore = useTaxStore();
const userStore = useUserStore();
// variables

const showState = ref(false);
const loading = ref(false);

const showSuccess = ref(false);
const disabled = ref(true);
const responseData = ref<any>();
const state = ref<string>("");
const dataObj = ref<{ enable: boolean; state: string; pay_id: string }>({
  enable: true,
  state: "",
  pay_id: "",
});

// emits
// emits
const emit = defineEmits<{
  (e: "loadingTrue"): void;
  (e: "loadingFalse"): void;
}>();

// const state = ref<StateEnum>();

// provide and inject
provide("showState", showState);
provide("selectedState", state);
// methods

const saveChanges = async () => {
  if (state.value !== "" && dataObj.value.pay_id !== "") {
    dataObj.value.state = state.value;

    loading.value = true;
    emit("loadingTrue");

    const response = await request(
      taxStore.updateSettings(dataObj.value),
      loading
    );

    emit("loadingFalse");

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && typeof successResponse !== "undefined") {
      // console.log(successResponse.data);
      responseData.value = successResponse;
    }
  }
};

// define expose
defineExpose({
  saveChanges,
});
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
          <p class="text-base font-medium">
            Configure tax breakdown for states
          </p>
          <p class="text-sm text-gray-rgba-3">
            Enter company Tax details to be able to set up your employees for
            Tax payments
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="grid sm:grid-cols-2 pt-7 gap-4">
          <div class="relative">
            <div
              class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
            >
              <input
                @click="[(showState = true), (disabled = false)]"
                :value="state"
                type="text"
                class="rounded-lg text-black text-sm outline-none py-4 border-none focus:outline-none focus:border-none"
                placeholder="Select State"
              />
              <span @click="showState = !showState">
                <IArrowDown />
              </span>
            </div>
            <div
              class="absolute z-50 h-56 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
              v-if="showState == true"
            >
              <div>
                <component :is="State"></component>
              </div>
            </div>
          </div>

          <div
            class="cursor-pointer font-normal items-center py-3 text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
          >
            <input
              required
              v-model="dataObj.pay_id"
              type="text"
              class="rounded-lg text-sm outline-none border-none text-black focus:outline-none docus:border-none"
              placeholder="0"
            />
            <span class="text-sm text-black-100">Enter PAY-ID</span>
          </div>
          <!-- <div class="relative">
            <input
              type="text"
              id="Name2"
              maxlength="55"
              class="input-float peer pr-10.5"
              placeholder=""
            />
            <label
              for="Name3"
              class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
            >
              Select state</label
            >
          </div>
          <div
            class="cursor-pointer font-normal items-center py-3 text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
          >
            <input
              type="text"
              class="rounded-lg text-sm text-black outline-none border-none focus:outline-none docus:border-none"
              placeholder="0"
            />
            <span class="text-sm text-black-100">Enter PAY-ID</span>
          </div>
          <div class="relative">
            <input
              type="text"
              id="Nam"
              maxlength="55"
              class="input-float peer pr-10.5"
              placeholder=""
            />
            <label
              for="Nam"
              class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
            >
              Select state</label
            >
          </div>
          <div
            class="cursor-pointer font-normal items-center py-3 text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
          >
            <input
              type="text"
              class="rounded-lg text-sm text-black outline-none border-none focus:outline-none docus:border-none"
              placeholder="0"
            />
            <span class="text-sm text-black-100">Enter PAY-ID</span>
          </div> -->
        </div>
        <!--  -->
        <div class="flex">
          <ButtonLightBlue @click="saveChanges">
            <template v-slot:placeholder> <span>+ Add new item</span></template>
          </ButtonLightBlue>
        </div>
      </div>
    </div>
    <div class="flex-1 w-full"></div>
  </div>
</template>

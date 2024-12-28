<script lang="ts" setup>
import { ref } from "vue";
import spinner from "../components/timer/Spinner.vue";
import { IArrowLeftTail } from "../core/icons";
import { isActiveRoute } from "../core/router";
import { useRouter } from "vue-router";




const router = useRouter();
const isEditForm = ref(false);
const loading = ref(false);
const childComponent = ref<any>();

// methods
const save = () => {
  childComponent.value.saveChanges().then(() => {});
};

</script>
<template>
  <div>
    <div class="bg-white rounded-t-lg divide-y divide-grey-200">
      <div class="px-6+1">
        <div
          class="flex items-center justify-between py-8 overflow-auto scrollbar-hide lg:space-x-0 space-x-4"
        >
          <div class="flex items-start space-x-5-1">
            <button @click="router.push('/dashboard/tax-compliance')">
              <IArrowLeftTail />
            </button>
            <div>
              <h3
                class="text-black-rgba font-medium lg:text-2xl text-lg whitespace-nowrap"
              >
                Tax Settings
              </h3>
              <span class="text-sm text-gray-rgba-3 whitespace-nowrap"
                >Manage tax breakdown and remittance</span
              >
            </div>
          </div>

          <div class="flex space-x-4 whitespace-nowrap">
            <button
              @click="save"
              class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
            >
              <spinner v-if="loading == true" />
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
        <!--  -->
        <!-- nav tabs -->
        <div
          class="flex items-center space-x-8 text-blue-900 w-full overflow-auto scrollbar-hide"
        >
          <div
            @click="
              router.push({
                name: 'dashboard.tax-compliance.settings.edit-state-break-down',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute(
                'dashboard.tax-compliance.settings.edit-state-break-down'
              )
                ? 'border-b-2  border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Edit State Breakdown </span>
          </div>
          <div
            @click="
              router.push({
                name: 'dashboard.tax-compliance.settings.update-employee-tax',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute(
                'dashboard.tax-compliance.settings.update-employee-tax'
              )
                ? 'border-b-2 border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Employee Tax Update </span>
          </div>
          <!--  -->
          <div
            @click="
              router.push({
                name: 'dashboard.tax-compliance.settings.download-data',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute('dashboard.tax-compliance.settings.download-data')
                ? 'border-b-2 border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Download Tax Data </span>
          </div>
          <!--  -->
          <div
            @click="
              router.push({
                name: 'dashboard.tax-compliance.settings.disable-remittance',
              })
            "
            role="button"
            class="pb-6 text-sm cursor-pointer whitespace-nowrap"
            :class="[
              isActiveRoute(
                'dashboard.tax-compliance.settings.disable-remittance'
              )
                ? 'border-b-2 border-blue-400 font-medium text-[#003b3d]'
                : '',
            ]"
          >
            <span> Disable Remittance </span>
          </div>
        </div>
      </div>
      <!--  -->
      <router-view
        v-slot="{ Component }"
        class="bg-white py-6 min-h-[80vh] h-auto px-6"
      >
        <component
          ref="childComponent"
          :is="Component"
          @loadingTrue="loading = true"
          @loadingFalse="loading = false"
        />
      </router-view>
    </div>
  </div>
</template>

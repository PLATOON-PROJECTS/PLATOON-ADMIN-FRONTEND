<script setup lang="ts">
import ButtonBlueOutline from "../../../components/buttons/ButtonBlueOutline.vue";
import FCheckedComponent from "../../../components/forms/FCheckBox.vue";
import { inject } from "vue";
// inject
const openUpdateUser = inject("openUpdateUser");
</script>

<template>
  <div class="grid sm:grid-cols-2 px-4 gap-5">
    <div class="h-full rounded-lg p-4 bg-blue-lighter space-y-8">
      <div class="items-center">
        <div class="flex flex-col">
          <span class="text-xl font-semimedium">Super Admin Access</span>
        </div>
      </div>
      <div class="space-y-5">
        <p class="text-sm font-semimedium">ACCESS</p>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Employees </span>
              <span class="text-sm text-gray-rgba-4"
                >Remove and add employees</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Payroll</span>
              <span class="text-sm text-gray-rgba-4"
                >Manage employees, edit payroll settings and disable
                remittance</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Pension </span>
              <span class="text-sm text-gray-rgba-4"
                >Manage employees, edit payroll settings and disable
                remittance</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Tax & NHF </span>
              <span class="text-sm text-gray-rgba-4"
                >Manage employees, edit payroll settings and disable
                remittance</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Manage Users</span>
              <span class="text-sm text-gray-rgba-4"
                >Add, edit and remove admin users</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Company Settings</span>
              <span class="text-sm text-gray-rgba-4"
                >Update and delete company</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="h-full rounded-lg p-4 bg-blue-lighter space-y-8">
      <div class="items-center">
        <div class="flex justify-between lg:space-x-0 space-x-2">
          <span class="text-xl font-semimedium">Approver Access</span>
          <div class="whitespace-nowrap">
            <ButtonBlueOutline @click="openUpdateUser = true">
              <template v-slot:placeholder>Edit Role access</template>
            </ButtonBlueOutline>
          </div>
        </div>
      </div>
      <div class="space-y-5">
        <p class="text-sm font-semimedium">ACCESS</p>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Employees</span>
              <span class="text-sm text-gray-rgba-4"
                >View, edit and Approve new employees</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Payroll</span>
              <span class="text-sm text-gray-rgba-4"
                >View and approve payroll</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Pension</span>
              <span class="text-sm text-gray-rgba-4"
                >View and approve payroll</span
              >
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="flex space-x-2">
            <FCheckedComponent />
            <div class="flex flex-col">
              <span class="text-md font-semimedium">Tax & NHF</span>
              <span class="text-sm text-gray-rgba-4"
                >View and approve payroll</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

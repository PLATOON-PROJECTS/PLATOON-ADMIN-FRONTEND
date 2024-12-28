<script setup lang="ts">
import FCheckedComponent from "../../../components/forms/FCheckBox.vue";
</script>
<template>
  <div class="h-full px-6 space-y-5">
    <div class="items-center">
      <div class="flex flex-col">
        <span class="text-md font-semimedium">Select access to give in this module</span>
      </div>
    </div>

    <div class="items-center">
      <div class="flex space-x-2">
        <FCheckedComponent />
        <div class="flex flex-col">
          <span class="text-md ">Add employees and invite employees
          </span>
        </div>
      </div>
    </div>
    <div class="items-center">
      <div class="flex space-x-2">
        <FCheckedComponent />
        <div class="flex flex-col">
          <span class="text-md ">View and sort employees by department
          </span>
        </div>
      </div>
    </div>
    <div class="items-center">
      <div class="flex space-x-2">
        <FCheckedComponent />
        <div class="flex flex-col">
          <span class="text-md ">Create department and grades
          </span>
        </div>
      </div>
    </div>
    <div class="items-center">
      <div class="flex space-x-2">
        <FCheckedComponent />
        <div class="flex flex-col">
          <span class="text-md ">Pay by grades and sort by either grade or department
          </span>
        </div>
      </div>
    </div>
    <div class="items-center">
      <div class="flex space-x-2">
        <FCheckedComponent />
        <div class="flex flex-col">
          <span class="text-md ">Deduction and bonus on each employees view</span>
        </div>
      </div>
    </div>
    <div class="items-center">
      <div class="flex space-x-2">
        <FCheckedComponent />
        <div class="flex flex-col">
          <span class="text-md ">Approve requests</span>
        </div>
      </div>
    </div>
  </div>
</template>

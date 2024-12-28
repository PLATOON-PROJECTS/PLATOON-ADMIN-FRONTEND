<script setup lang="ts">
import { IArrowDown } from "../../../core/icons";
</script>
<template>
  <div class="lg:px-0 lg:flex justify-center px-6 w-full">
    <div class="space-y-5">
      <div class="lg:w-[75%]">
        <div class="space-y-1">
          <p class="text-base font-medium">Contact information</p>
          <p class="text-sm text-gray-rgba-3">
            Details of company representative
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="pt-7 space-y-2">
          <p class="text-base font-medium text-black-rgba-100">Contact</p>

          <div class="grid sm:grid-cols-2 gap-4">
            <div
              class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
            >
              <input
                type="text"
                class="rounded-lg text-black  text-sm py-4 outline-none border-none focus:outline-none docus:border-none"
                placeholder="Select Industry"
              />
              <span>
                <IArrowDown />
              </span>
            </div>

            <div class="relative">
              <input
                type="text"
                id="Emalrole"
                maxlength="55"
                class="input-float peer pr-10.5"
              />
              <label
                for="Emalrole"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Emal role</label
              >
            </div>

            <div class="relative">
              <input
                type="text"
                id="firstname"
                maxlength="55"
                class="input-float peer pr-10.5"
              />
              <label
                for="firstname"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                First Name</label
              >
            </div>

            <div class="relative">
              <input
                type="text"
                id="lastname"
                maxlength="55"
                class="input-float peer pr-10.5"
              />
              <label
                for="lastname"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Contact last name</label
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

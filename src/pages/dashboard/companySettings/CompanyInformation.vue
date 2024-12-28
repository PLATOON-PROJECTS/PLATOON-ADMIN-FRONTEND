<script setup lang="ts">
import { IArrowDown } from "../../../core/icons";
</script>

<template>
  <div class="lg:px-0 lg:flex justify-center px-6 w-full">
    <div class="space-y-5">
      <div class="lg:w-[75%]">
        <div class="space-y-1">
          <p class="text-base font-medium">Company information</p>
          <p class="text-sm text-gray-rgba-3">
            Edit details as registered with CAC
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="pt-7 space-y-2">
          <p class="text-base font-medium text-black-rgba-100">Contact</p>

          <div class="grid sm:grid-cols-2 gap-4">
            <!-- Name -->
            <div class="relative">
              <input
                type="text"
                id="name"
                maxlength="100"
                placeholder="Name of Company"
                class="input-float peer pr-10.5"
              />
              <label
                for="name"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Name
              </label>
            </div>

            <!-- Email Address -->
            <div class="relative">
              <input
                type="email"
                id="email"
                maxlength="100"
                placeholder="Email Address"
                class="input-float peer pr-10.5"
              />
              <!-- <label
                for="email"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Email Address
              </label> -->
            </div>

            <!-- Phone Number -->
            <div class="relative">
              <input
                type="tel"
                id="phone"
                maxlength="15"
                placeholder="Phone Number"
                class="input-float peer pr-10.5"
              />
              <!-- <label
                for="phone"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Phone Number
              </label> -->
            </div>

            <!-- Select Industry -->
            <div
              class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
            >
              <select
                class="rounded-lg text-black text-sm py-4 outline-none border-none w-full"
                id="industry"
              >
                <option value="" disabled selected>Select Industry</option>
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <!-- Add more industries as needed -->
              </select>
            </div>
          </div>

          <!-- Select State -->
          <div class="pt-7 space-y-2">
            <p class="text-base font-medium text-black-rgba-100">
              Company Location
            </p>
            <div class="grid sm:grid-cols-2 gap-4">
              <div
                class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
              >
                <select
                  class="rounded-lg text-black text-sm py-4 outline-none border-none w-full"
                  id="state"
                >
                  <option value="" disabled selected>Select State</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="rivers">Rivers</option>
                  <!-- Add more states as needed -->
                </select>
              </div>

              <!-- City -->
              <div class="relative">
                <input
                  type="text"
                  id="city"
                  maxlength="100"
                  placeholder="City"
                  class="input-float peer pr-10.5"
                />
                <!-- <label
                  for="city"
                  class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                >
                  City
                </label> -->
              </div>

              <!-- Company Address -->
              <div class="relative col-span-1">
                <textarea
                  id="address"
                  maxlength="255"
                  rows="4"
                  placeholder="Company Address"
                  class="input-float peer w-full pr-10.5"
                ></textarea>
                <!-- <label
                  for="address"
                  class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                >
                  Company Address
                </label> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

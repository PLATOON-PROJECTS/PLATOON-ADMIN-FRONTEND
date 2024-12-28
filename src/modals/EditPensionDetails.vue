<script setup lang="ts">
import { inject } from "vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { IClose } from "../core/icons";
import { IArrowDown } from "../core/icons";
// inject
const isOpen = inject<any>("isOpen");
</script>

<template>
  <Transition
    name="edit-pension-modal"
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight"
    :duration="400"
  >
    <div class="w-screen z-50 bg-[#000000A3] min-h-screen h-full fixed">
      <div class="flex justify-center px-3">
        <div
          class="lg:p-9 p-5 lg:w-1/3 rounded-lg inline-block align-middle bg-white sm:mt-24 mt-10 space-y-12"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-black-rgba font-medium text-2xl">
                Ighayere Ehondor Jemima
              </h3>
              <span class="font-semimedium text-black-rgba-100"
                >Edit Pension details</span
              >
            </div>
            <button
              @click="isOpen = false"
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
                PFA Number
              </p>
              <div class="flex justify-between items-center">
                <span class="sm:text-sm text-xs text-black whitespace-nowrap"
                  >Stanbic IBTC Pensions Managers Limited</span
                >
                <span>
                  <IArrowDown />
                </span>
              </div>
            </div>
            <!--  -->

            <div
              class="font-normal text-left rounded-xl pl-4 py-3 my-4 border text-gray-rgba-3 mb-1"
            >
              <input
                type="text"
                class="rounded-lg sm:text-sm text-xs outline-none   text-black placeholder-strong border-none focus:outline-none docus:border-none"
                placeholder="PFA Number"
              />
            </div>
            <!--  -->

            <div
              class="font-normal text-left rounded-xl pl-4 py-3 my-4 border text-gray-rgba-3 mb-1"
            >
              <input
                type="text"
                class="rounded-lg sm:text-sm text-xs  text-black placeholder-strong outline-none border-none focus:outline-none docus:border-none"
                placeholder="Voluntary Contribution"
              />
            </div>
          </div>
          <div class="flex pb-5">
            <ButtonBlue>
              <template v-slot:placeholder>Save Changes</template>
            </ButtonBlue>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

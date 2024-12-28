<script setup lang="ts">
import { IEyeOpened } from "../../../../core/icons";
import FCheckedComponent from "../../../../components/forms/FCheckBox.vue";
import FSwitchBox from "../../../../components/forms/FSwitchBox.vue";
import ButtonLightBlue from "../../../../components/buttons/ButtonLightBlue.vue";
</script>
<template>
    <div class="">
        <div class="space-y-6 divide-y divide-grey">
            <!--  -->
            <div class="flex pt-6">
                <div class="lg:flex-1">
                    <div class="flex justify-between">
                        <div class="space-y-1">
                            <p class="text-base font-medium">Enable Advanced Salary Breakdown</p>
                            <p class="text-sm text-gray-rgba-3 w-2/3">
                                This enables you break down your employee salaries (e.g. Basic, Housing and
                                Transport).
                            </p>
                        </div>
                        <FSwitchBox :value="false" id="id2" />
                    </div>
                    <div class="space-y-8">
                        <div class="grid lg:grid-cols-2 pt-7 gap-4">
                            <div class="relative">
                                <input type="text" id="Name" maxlength="55" class="input-float peer pr-10.5"
                                    placeholder="" />
                                <label for="Name"
                                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                                    Item</label>
                            </div>

                            <div class="relative">
                                <input type="text" id="1" maxlength="54" class="input-float peer pr-10.5"
                                    placeholder="0.0" />
                                <label for="1"
                                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                                </label>
                                <span class="absolute right-4 top-4+2">
                                    %
                                </span>
                            </div>
                            <div class="relative">
                                <input type="text" id="Name2" maxlength="55" class="input-float peer pr-10.5"
                                    placeholder="" />
                                <label for="Name3"
                                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                                    Item</label>
                            </div>
                            <div class="relative">
                                <input type="text" id="1s" maxlength="54" class="input-float peer pr-10.5"
                                    placeholder="0.0" />
                                <label for="1s"
                                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                                </label>
                                <span class="absolute right-4 top-4+2">
                                    %
                                </span>
                            </div>
                            <div class="relative">
                                <input type="text" id="Nam" maxlength="55" class="input-float peer pr-10.5"
                                    placeholder="" />
                                <label for="Nam"
                                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                                    Item</label>
                            </div>
                            <div class="relative">
                                <input type="text" id="1sa" maxlength="54" class="input-float peer pr-10.5"
                                    placeholder="0.0" />
                                <label for="1sa"
                                    class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                                </label>
                                <span class="absolute right-4 top-4+2">
                                    %
                                </span>
                            </div>
                        </div>
                        <!--  -->
                        <div class="flex">
                            <ButtonLightBlue>
                                <template v-slot:placeholder>+ Add new item</template>
                            </ButtonLightBlue>
                        </div>
                    </div>
                </div>
                <div class="flex-1 w-full"></div>
                <!--  -->
            </div>
            <!--  -->
            <div class="flex pt-6">
                <div class="lg:flex-1">
                    <div class="flex justify-between">
                        <div class="space-y-1">
                            <p class="text-base font-medium">Leave Allowance</p>
                            <p class="text-sm text-gray-rgba-3 w-2/3">
                                This allows you add a percentage of your employees salary as leave allowance to be paid
                                when an employee goes on leave.
                            </p>
                        </div>
                        <FSwitchBox :value="false" id="id1" />
                    </div>
                    <div class="grid lg:grid-cols-2 pt-7 gap-4">
                        <div class="relative">
                            <input type="text" id="Name" value="0.0" maxlength="55" class="input-float peer pr-10.5"
                                placeholder="" />
                            <label for="Name"
                                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
                                Percentage of Salary</label>
                            <span class="absolute right-4 top-4+2">
                                %
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex-1 w-full"></div>
                <!--  -->
            </div>
            <!--  -->
            <div class="flex py-6">
                <div class="lg:flex-1">
                    <div class="flex justify-between">
                        <div class="space-y-1">
                            <p class="text-base font-medium">Payroll Pension</p>
                            <p class="text-sm text-gray-rgba-3">
                                This allows you add a percentage of your employees salary as
                                leave allowance to be paid when an employee goes on leave.
                            </p>
                        </div>
                        <FSwitchBox :value="false" id="id4" />
                    </div>
                </div>
                <div class="flex-1 w-full"></div>
                <!--  -->
            </div>
            <!--  -->
            <div class="flex py-6">
                <div class="lg:flex-1">
                    <div class="flex justify-between">
                        <div class="space-y-1">
                            <p class="text-base font-medium">Payroll NHF Contribution</p>
                            <p class="text-sm text-gray-rgba-3">
                                This allows you add a percentage of your employees salary as
                                leave allowance to be paid when an employee goes on leave.
                            </p>
                        </div>
                        <FSwitchBox :value="false" id="
            id5" />
                    </div>
                </div>
                <div class="flex-1 w-full"></div>
                <!--  -->
            </div>
            <!--  -->
            <div class="flex py-6">
                <div class="lg:flex-1">
                    <div class="flex justify-between">
                        <div class="space-y-1">
                            <p class="text-base font-medium">Payroll NSITF Contribution</p>
                            <p class="text-sm text-gray-rgba-3">
                                This allows you add a percentage of your employees salary as
                                leave allowance to be paid when an employee goes on leave.
                            </p>
                        </div>
                        <FSwitchBox :value="false" id="id6" />
                    </div>
                </div>
                <div class="lg:flex-1 w-full"></div>
                <!--  -->
            </div>
            <!--  -->
            <div class="flex py-6">
                <div class="lg:flex-1">
                    <div class="flex justify-between">
                        <div class="space-y-1">
                            <p class="text-base font-medium">Payroll ITF Contribution</p>
                            <p class="text-sm text-gray-rgba-3">
                                This allows you add a percentage of your employees salary as
                                leave allowance to be paid when an employee goes on leave.
                            </p>
                        </div>
                        <FSwitchBox :value="false" id="id7" />
                    </div>
                </div>
                <div class="flex-1 w-full"></div>
                <!--  -->
            </div>
            <!--  -->
        </div>
    </div>
</template>
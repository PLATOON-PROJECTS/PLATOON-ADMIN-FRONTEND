<script lang="ts" setup>
import { ref, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import Card from "../components/cards/Card.vue";
import { IDoubleMark, ILinkHorizontal } from "../core/icons";
import { isActiveRoute } from "../core/router";
import AddEmployeesToDepartment from "../modals/AddEmployeesToDepartment.vue";
import CreateDepartment from "../modals/CreateDepartment.vue";
import InviteEmployee from "../modals/InviteEmployee.vue";
import { request } from "../composables/request.composable";
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable";
import { useEmployeeStore, useUserStore, useGroupStore } from "../store/index";
import cache from "../composables/swr_cache";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import { integer } from "@vuelidate/validators";
import spinner from "../components/timer/Spinner.vue";
import { getItem } from "../core/utils/storage.helper";

// initialize store
const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const groupStore = useGroupStore();

const route = useRoute();
const router = useRouter();
const successMessage = ref("");
const showModal = ref(false);
const emptyDept = ref(false);
const isInviteEmployee = ref(false);
const isCreateDepartment = ref(false);
const isAddEmployeeDepartment = ref(false);
const inviteData = ref<any>([]);
const employeeData = ref<any>([]);
const groupData = ref<any>([]);
const selectedDepartmentId = ref("");
const departmentState = ref(true);
const openImportCSV = ref(false);
const showSuccess = ref(false);
const previewCSV = ref(false);
const downloading = ref(false);
const showConfirm = ref(false);
const confirmMessage = ref({ message: "" });
const confirmType = ref("");
const csv64 = ref("");
const csvContent:any = ref([]);
const loading = ref(false)
const csvInput = ref(null);
const previewing = ref(false);
const errorHeader = ref([]);
const hasError = ref(false);
const loadingDepartment = ref(true);
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const ErrorLog:any = ref([]);
const headerError:any = ref([]);

const showError:any = ref([]);

const responseData = ref<any>({ data: [], message: "" });
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;

// Access the organisationId safely
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

console.log("Organisation ID:", organisationId);

// methods
const updateId = (id: any) => {
  selectedDepartmentId.value = id;
};
const fetchInviteEmployees = async () => {
  const totalPendingEmployeeCache = cache("total_pending_employees");
  if (typeof totalPendingEmployeeCache !== "undefined") {
    inviteData.value = totalPendingEmployeeCache;
  }
  const response = await request(employeeStore.invitationIndex());

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    inviteData.value = successResponse.data.data;
    cache("total_pending_employees", successResponse.data.data);
    console.log(successResponse.data);
    console.log(successResponse.data.data);
  }
};
fetchInviteEmployees();

const fetchEmployees = async (page = 1) => {
  loading.value = true;
  const totalEmployeeCached = cache("total_employees_length");
  console.log("&&&&", totalEmployeeCached)
  if (typeof totalEmployeeCached !== "undefined") {
    employeeData.value = totalEmployeeCached;
  }
  const response = await request(employeeStore.index(organisationId, 10, page));

  const successResponse = handleSuccess(response);
  loading.value = false; 
  if (successResponse && typeof successResponse !== "undefined") {
    employeeData.value = successResponse.data.data.pageItems.length;
    cache("total_employees_length", employeeData.value);
    console.log("*********",successResponse.data.data.pageItems.length);
    console.log("****++++++*****",employeeData.value);
  }
};
fetchEmployees();

const fetchGroups = async () => {
  const groupCachedData = cache("total_departments");
  console.log("&&&&", groupCachedData)
  if (typeof groupCachedData !== "undefined") {
    groupData.value = groupCachedData;
    loadingDepartment.value = false;
  }

  const response = await request(groupStore.totalDepartment(organisationId));
  loadingDepartment.value = false;

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    groupData.value = successResponse.data.data;
    cache("total_departments", groupData.value);
    console.log("!!!!!!!!", groupData.value);
  }
};
fetchGroups();

const download = () => {
  confirmType.value = "download";
  confirmMessage.value.message =
    "Employee  data will be downloaded to your local storage";

  showConfirm.value = true;
};

const csvToBase64 = async (data:any) => {
  const file = data.target.files[0];
  
  // Check if a file is selected
  if (!file) {
    console.error('No file selected!');
    return;
  }

  const reader = new FileReader();

  try {
    // Read file content as text
    const fileContent:any = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    // Convert text to Base64
    csv64.value = btoa(fileContent);

  } catch (error) {
    console.error('An error occurred while reading the file:', error);
  }
}


// const importCsv = async () => {
//   downloading.value = true;
//   loading.value = true;

//   const response = await request(employeeStore.importCsvFile(csv64.value), downloading);

//   handleError(response, userStore);
//   const successResponse = handleSuccess(response, showSuccess);
//   loading.value = false;

//   if (successResponse && typeof successResponse !== "undefined") {
//     // console.log(successResponse.data);
//     // console.log('---')
//     showSuccess.value = true;
//     successResponse.message = "Your Import Is Ready.";
//     csvContent.value = successResponse.data;
//     responseData.value.message= successResponse.message;

//     csvContent.value.data.forEach((element:any) => {
//       employeeData.value.push(element);
//     })

//     // console.log(successResponse);

//     previewCSV.value = false;
//     openImportCSV.value = false;
//     window.location.reload();
//   }
// };

// const importCsv = async () => {
//   downloading.value = true;
//   loading.value = true;

//   const formData = new FormData();

//   console.log("Import Organisation ID:", organisationId);

//   // Append the CSV file and OrganisationId to the FormData
//   formData.append('csvfile', new Blob([atob(csv64.value)], { type: 'text/csv' }), 'employees.csv');
//   formData.append('OrganisationId', organisationId.toString()); 

//   try {
//     const response = await employeeStore.importCsvFile(formData);
    
//     handleError(response, userStore);
//     const successResponse = handleSuccess(response, showSuccess);
    
//     loading.value = false;

//     if (successResponse && typeof successResponse !== "undefined") {
//       showSuccess.value = true;
//       successResponse.message = "Your Import Is Ready.";
//       csvContent.value = successResponse.data;
//       responseData.value.message = successResponse.message;

//       // Assuming the response contains the imported data
//       csvContent.value.data.forEach((element:any) => {
//         employeeData.value.push(element);
//       });
//       openImportCSV.value = false;
//       window.location.reload(); // Refresh the page or fetch updated data
//     }
//   } catch (error) {
//     loading.value = false;
//     console.error("Error during CSV import:", error);
//   }
// };

const handleCsvUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) {
    console.error('No file selected!');
    return;
  }

  if (!organisationId) {
    console.error('Organisation ID not found!');
    return;
  }

  try {
    const response = await employeeStore.importCsvFile({
      file,
      organisationId,
    });

    console.log('CSV uploaded successfully:', response);
    showModal.value = false; 
    showSuccess.value = true;
    successMessage.value = 'CSV imported successfully!';
  } catch (error) {
    console.error('Error uploading CSV:', error);
    showError.value = true;
  } finally {
    clearInput();
  }
};

const downloadCsvTemplate = async () => {
  loading.value = true;
  try {
    await employeeStore.downloadCsvTemplate();
    successMessage.value = "Template downloaded successfully!";
    showModal.value = false; 
    // showSuccess.value = true;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

const importCsv = async () => {
  showModal.value = true;

};


// const previewCsvAction = async (file:any) => {
//   previewing.value = true;
//   hasError.value = false

//   const csvWatchList = ['firstname', 'lastname', 'email', 'telephone', 'bank', 'bank_code', 'account_name', 'account_number', 'payout_amount'];

//   if(file.target.value){
//     downloading.value = true;
  
//     await csvToBase64(file);
//     headerError.value = [];
  
//     const response = await request(employeeStore.previewCsvFile(csv64.value), downloading);
  
//     openImportCSV.value = false;
//     handleError(response, userStore);
  
//     const successResponse = handleSuccess(response, showSuccess);
//     // openImportCSV.value = false;
  
//     if (successResponse && typeof successResponse !== "undefined") {
//       // console.log(successResponse.data);
//       // console.log('---')
//       successResponse.message = "Your Import Is Ready.";
//       csvContent.value = successResponse.data;
//       responseData.value.message= successResponse.message;
//       ErrorLog.value = [];
  
//       let index = 0;
//       let allKeys:any = [];

//       allKeys = allKeys.concat(Object.keys(csvContent.value.data[0].row));

//       await allKeys.forEach((element:any) => {
//         const keyFound = csvWatchList.find((keys:any) => keys === element);
//         if(!keyFound){
//           hasError.value = true;
//           headerError.value.push(element);
//         }
//       })
      
//       if(hasError.value){
//         const errorHeaderIndicator:any = headerError.value.join(', ')
//         const Uppercase = errorHeaderIndicator.toUpperCase();

//         let errorResponse = {
//             data: {
//               message: 'Invalid Header '+Uppercase+', please download the Template and use the specified Headers.',
//               status: 500,
//             }
//         }
//         previewing.value = false;
//         previewCSV.value = false;
//         openImportCSV.value = false;
//         handleError(errorResponse, userStore);
//         clearInput();
//       }else{

//         csvContent.value.data.forEach((obj:any) => {
//           //check if any is empty
//           Object.keys(obj.row).some(key => {
//             if (!obj.row[key]) {
//               ErrorLog.value.push({
//                 keyName: key,
//                 index: index,
//                 message: "All Field Is Required.",
//               });
//             }
//           });
    
//           if(obj.row.telephone.length < 10 || obj.row.telephone.length > 11){
//             ErrorLog.value.push({
//                 keyName: 'telephone',
//                 index: index,
//                 message: "Telephone Should be 11 digits.",
//               });
//           }
    
//           if(obj.row.account_number.length !== 10){
//             ErrorLog.value.push({
//                 keyName: 'account_number',
//                 index: index,
//                 message: "Account Number Should be 10 digits.",
//               });
//           }
    
//           if(Number.isInteger(obj.row.telephone)){
//             ErrorLog.value.push({
//                 keyName: 'telephone',
//                 index: index,
//                 message: "Telephone Must Be A Number.",
//               });
//           }
    
//           if(Number.isInteger(obj.row.account_number)){
//             ErrorLog.value.push({
//                 keyName: 'account_number',
//                 index: index,
//                 message: "Account Number Must Be A Number.",
//               });    
//           }
    
//           if(Number.isInteger(obj.row.bank_code)){
//             ErrorLog.value.push({
//               keyName: 'bank_code',
//               index: index,
//               message: "Bank Code Must Be A Number",
//             }); 
//           }

//           if (obj.error.length) {
//             showError.value[index] = false;
//           }
    
//           index++;
//         });
//         previewCSV.value = true;
//       }

//       previewing.value = false;
//     }else{
//       openImportCSV.value = false;
//     }
//   }
//   previewing.value = false;
// };

const clearInput = () => {
  // console.log(csvInput)
  csvInput.value = null;
  // console.log('red')
}

const checkTable = (index:number, key:string) => {
  const found = ErrorLog.value.find((obj:any) => obj.index === index && obj.message === ErrorLog.value[0].message && obj.keyName == key);
  if(found){
    return true
  }
}

</script>
<template>
  <!-- MODALS -->
  <InviteEmployee
    v-if="isInviteEmployee"
    v-on:close="isInviteEmployee = !isInviteEmployee"
  />
  <CreateDepartment
    :departmentId="selectedDepartmentId"
    v-if="isCreateDepartment"
    v-on:close="isCreateDepartment = !isCreateDepartment"
  />
  <AddEmployeesToDepartment
    v-if="isAddEmployeeDepartment"
    v-on:close="isAddEmployeeDepartment = !isAddEmployeeDepartment"
  />

  <div class="px-6 py-9 space-y-6">
    <confirmAlert
      :showConfirm="showConfirm"
      @closeConfirm="showConfirm = false"
      v-if="showConfirm == true"
    >
      <template #title> Delete</template>
      <template #confirm>
        <span>
          CONFIRM
        </span>
      </template>
      <template #message> {{ confirmMessage.message }}</template>
    </confirmAlert>

    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ csvContent.message }}</successAlert
    >
    <div v-if="showModal" class="flex items-center justify-center fixed top-0 left-0 bg-black/20 h-screen w-screen z-[99999]" >
      <div class="box bg-white rounded-md md:w-[500px] w-[95%] h-[360px]">
        <header class="flex flex-col p-4">
          <div class="flex items-center justify-center ml-auto w-[40px] h-[40px] rounded-full bg-grey cursor-pointer" @click="showModal = false">
            <svg width="24px" height="24px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 21.32L21 3.32001" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 3.32001L21 21.32" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </div>
          <div class="text-left mt-7 px-[35px]">
            <h3  class="font-bold text-2xl whitespace-nowrap">Add Employees in Bulk</h3>
            <p class="text-sm pt-1 font-semimedium">Employee will recieve an email notification</p>
          </div>
          <div class="flex flex-col mt-7 gap-4 px-[35px]">
            <button @click="downloadCsvTemplate" class="bg-[#003b3d] text-center text-white px-4+1 py-2.5+1 rounded-full text-sm"
            >
              Download CSV Template
            </button>
            <!-- <a
              href="https://payroll.platoonco.com/storage/banks.xlsx"
              class="bg-[#003b3d] text-center text-white px-4+1 py-2.5+1 rounded-full text-sm"
            >
              Download Bank Codes
            </a> -->
            <label
              for="csvInput"
              class="bg-[#003b3d] text-center text-white px-4+1 py-2.5+1 rounded-full text-sm cursor-pointer"
            >
              <span>Import New CSV</span>
            </label>
            <input id="csvInput" ref="csvInput" type="file" accept=".csv" class="hidden" @change="handleCsvUpload">
          </div>
        </header>
      </div>
    </div>
    <div v-if="previewCSV" class="flex items-center justify-center fixed top-0 left-0 bg-black/20 h-screen w-screen z-[99999] overflow-hidden" @click.self="previewCSV = false, openImportCSV = false, clearInput()">
      <div class="box bg-white rounded-md md:w-[90%] w-[95%] md:h-[370px] h-[400px]">
        <header class="flex flex-col p-4">
          <div class="flex justify-between">
            <div class="text-[20px] font-bold">Preview <span class="text-[14px] text-[#852525]">{{ ErrorLog.length ? `(${ErrorLog[0].message})` : '' }}</span></div>
            <div class="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-grey cursor-pointer" @click="previewCSV = false, clearInput()">
              <svg width="24px" height="24px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 21.32L21 3.32001" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 3.32001L21 21.32" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
          </div>
          <div class="overflow-auto h-[220px]">
            <fieldset class="overflow-hidden sm:rounded-lg">
              <table class="min-w-full table-fixed">
                <thead
                  class="text-black-200 text-sm text-left"
                >
                  <tr>
                    <th
                      scope="col"
                      class="py-4 font-normal text-left flex items-center space-x-3 flex-shrink-0"
                    >
                      <!-- <CheckBox customClasses="indeterminate-check" /> -->

                      <div class="space-x-2 flex items-center"><span>FIRSTNAME</span></div>
                    </th>
                    <th scope=" col" class="py-4 font-normal text-left">LASTNAME</th>
                    <th scope="col" class="py-4 font-normal text-left">EMAIL</th>
                    <th scope="col" class="py-4 font-normal text-left">TELEPHONE</th>
                    <th scope="col" class="py-4 font-normal text-left">BANK</th>
                    <th scope="col" class="py-4 font-normal text-left">BANK_CODE</th>
                    <th scope="col" class="py-4 font-normal text-left">ACCOUNT NAME</th>
                    <th scope="col" class="py-4 font-normal text-left">ACCOUNT_NUMBER</th>
                    <th scope="col" class="py-4 font-normal text-left">PAYOUT_AMOUNT</th>
                  </tr>
                </thead>
                <tbody
                  class="bg-white divide-y divide-grey-200"
                >
                  <tr
                  v-for="(item, index) in csvContent?.data" :key="index" 
                    class="text-black-100"
                  >
                    <td class="py-4 w-[25%]" :class="{'border border-red':checkTable(index, 'firstname')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.firstname }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap" :class="{'border border-red':checkTable(index, 'lastname')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.lastname }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap" :class="{'border border-red':checkTable(index, 'email')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.email }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 whitespace-nowrap" :class="{'border border-red':checkTable(index, 'telephone')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.telephone }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap" :class="{'border border-red':checkTable(index, 'bank')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.bank }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap" :class="{'border border-red':checkTable(index, 'bank_code')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.bank_code }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap" :class="{'border border-red':checkTable(index, 'account_name')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.account_name }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap" :class="{'border border-red':checkTable(index, 'account_number')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.account_number }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="py-4 text-left whitespace-nowrap" :class="{'border border-red':checkTable(index, 'payout_amount')}">
                      <div class="flex items-center space-x-3 flex-shrink-0">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >{{ item.row.payout_amount }}</span
                          >
                        </div>
                      </div>
                    </td>
                    <td v-if="item.error.length">
                      <button type="button" class="error-preview block relative" @click="showError[index] = !showError[index]">
                        <svg v-if="!showError[index]" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 15H12.01M12 12V9M4.98207 19H19.0179C20.5615 19 21.5233 17.3256 20.7455 15.9923L13.7276 3.96153C12.9558 2.63852 11.0442 2.63852 10.2724 3.96153L3.25452 15.9923C2.47675 17.3256 3.43849 19 4.98207 19Z" stroke="#de1b1b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <svg v-else width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
                      </button>
                      <div class="error-preview-display absolute md:right-[100px] sm:right-[-100px] right-0 sm:w-[400px] w-full max-h-[400px] overflow-y-auto bg-[#f4f4f4] p-6 py-4 rounded-lg z-10" v-show="showError[index]">
                        <p v-for="(errorItem, errorIndex) in item.error" :key="errorIndex">
                          {{ `${1+errorIndex}. ${errorItem}` }}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </div>
          <div class="flex">
            <button
              @click="importCsv()"
              :disabled="ErrorLog.length || showError.length"
              class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm mt-7 ml-auto"
            >
              <spinner v-if="loading == true" /> <span v-else>Confirm Import</span>
            </button>
          </div>
        </header>
      </div>
    </div>
    <div
      class="flex items-center justify-between"
      v-if="route.meta?.showEmployeeCards"
    >
      <div class="flex items-center space-x-5-1">
        <span class="text-black-rgba font-medium lg:text-2xl text-lg"
          >Employees</span
        >
      </div>
      <div class="flex gap-3" v-if="!loadingDepartment">
        
        <button
          v-if="isActiveRoute('dashboard.employees.all')"
          @click="importCsv"
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
        >
        + Import CSV
        </button>
        <button
          v-if="isActiveRoute('dashboard.employees.all')"
          @click="groupData? isInviteEmployee = !isInviteEmployee : emptyDept = true"
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm" :class="{'opacity-50':emptyDept}"
        >
          {{ !emptyDept ? '+ Invite User' : 'Create Department First'}}
        </button>
        <button
        v-else
          @click="isCreateDepartment = !isCreateDepartment"
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
        >
        + Create Department
        </button>
        <button
        @click="
        router.push({
          name: 'dashboard.employees.multiple',
        })
      "
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
        >
        + Invite Multiple Users
        </button>
        <!-- <button
          v-if="isActiveRoute('dashboard.employees.departments')"
          @click="isCreateDepartment = !isCreateDepartment"
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
        >
          + Create Department
        </button> -->
      </div>
      <div class="flex gap-3" v-else>
        <button
          class="bg-[#003b3d] text-white px-4+1 py-2.5+1 rounded-full text-sm"
        >
          Loading please Wait...
        </button>
      </div>
    </div>
    <!-- cards-->
    <div
      class="grid lg:grid-cols-3 lg:gap-6 gap-4"
      v-if="route.meta?.showEmployeeCards"
    >
      <router-link to="/dashboard/employees">
        <Card
          :activeColor="
            isActiveRoute('dashboard.employees.all')
              ? 'bg-[#003b3d] bg-eclipse-svg-[#003b3d] text-black'
              : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.employees.all')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.employees.all')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.employees.all')
              ? 'bg-white/40'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Employees</template>
          <template v-slot:text>Total employees available</template>
          <template v-slot:icon>
            <IDoubleMark />
          </template>

           <template v-slot:other-informations>
            {{ employeeData }}
          </template>
        </Card>
      </router-link>
      <router-link to="/dashboard/employees/pending">
        <Card
          :activeText="
            isActiveRoute('dashboard.employees.pending')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.employees.pending')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.employees.pending')
              ? 'bg-[#fff]/40'
              : 'bg-grey-100'
          "
          :activeColor="
            isActiveRoute('dashboard.employees.pending')
              ? 'bg-[#074789] bg-eclipse-svg-white'
              : 'bg-white'
          "
        >
          <template v-slot:title>Pending Employees</template>
          <template v-slot:text>Pending Employees</template>
          <template v-slot:icon>
            <ILinkHorizontal />
          </template>
          <template v-slot:other-informations>
            {{ inviteData }}
          </template>
        </Card>
      </router-link>
      <router-link to="/dashboard/employees/departments">
        <Card
          :activeColor="
            isActiveRoute('dashboard.employees.departments')
              ? 'bg-black'
              : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.employees.departments')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.employees.departments')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.employees.departments')
              ? 'bg-black-300'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Departments</template>
          <template v-slot:text>Total departments</template>
          <template v-slot:icon>
            <ILinkHorizontal />
          </template>
          <template v-slot:other-informations>{{
            groupData && groupData 
          }}</template>
        </Card>
      </router-link>
    </div>
    <!-- Table -->
    <main>
      <router-view v-slot="{ Component }">
        <component
          @refetchInvite="fetchInviteEmployees"
          @refetchDepartment="fetchGroups"
          :is="Component"
          @updateId="updateId"
          @showInviteEmployee="isInviteEmployee = true"
          @showCreateDepartment="isCreateDepartment = true"
          @emptyDepartment="departmentState = false"
        />
      </router-view>
    </main>
  </div>
</template>
<style scoped>
/* .error-preview-display{
  display: none;
} */
  /* .error-preview:hover + .error-preview-display{
    display: block;
  } */
</style>

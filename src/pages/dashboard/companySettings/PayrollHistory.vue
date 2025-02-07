<script setup lang="ts">
import { ref, onMounted } from "vue";
import EmptyState from "../../../components/EmptyState.vue";
import { IUserThree } from "../../../core/icons";
import { request } from "../../../composables/request.composable";
import spinner from "../../../components/timer/Spinner.vue";
import { useWalletStore, usePayrollStore } from "../../../store/index";
import html2pdf from "html2pdf.js";
import { formatNumber, dateFormat } from "../../../core/helpers/actions";
import { useRoute } from "vue-router";

// Initialize route
const route = useRoute();

// Initialize store
const walletStore = useWalletStore();
const payrollStore = usePayrollStore();

// Reactive variables
const totalRevenueData = ref<any>({ data: {}, message: "" });
const totalFundDisbursed = ref<any>({ data: {}, message: "" });
const totalFundReceived = ref<any>({ data: {}, message: "" });
const pendingDisbursementData = ref<any>({ data: {}, message: "" });
const payrollData = ref<any[]>([]);
const loading = ref(false);
const slip = ref({
  name: "",
  narration: "",
  paymentDate: "",
  grossPay: 0,
  bonus: 0,
  deductions: 0,
  tax: 0,
  netPay: 0,
});
const generatingPDF = ref<{ [key: number]: boolean }>({}); // Track loading state for each row

// Fetch data on mounted
onMounted(() => {
  fetchTotalRevenue();
  fetchTotalFundReceived();
  fetchPendingDisbursement();
  fetchTotalFundDisbursed();
  fetchCompanyPayrollById();
});

// Fetch total revenue
const fetchTotalRevenue = async () => {
  loading.value = true;
  try {
    const response = await request(walletStore.getTotalRevenue());
    if (response?.data) {
      totalRevenueData.value = [response.data.data];
    }
  } catch (error) {
    console.error("Failed to fetch total revenue:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch total funds received
const fetchTotalFundReceived = async () => {
  loading.value = true;
  try {
    const response = await request(walletStore.getTotalFundReceived());
    if (response?.data) {
      totalFundReceived.value = [response.data.data];
    }
  } catch (error) {
    console.error("Failed to fetch total funds received:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch pending disbursement
const fetchPendingDisbursement = async () => {
  loading.value = true;
  try {
    const response = await request(walletStore.pendingDisbursement());
    if (response?.data) {
      pendingDisbursementData.value = [response.data.data];
    }
  } catch (error) {
    console.error("Failed to fetch pending disbursement:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch total funds disbursed
const fetchTotalFundDisbursed = async () => {
  loading.value = true;
  try {
    const response = await request(walletStore.getTotalFundDisbursed());
    if (response?.data) {
      totalFundDisbursed.value = [response.data.data];
    }
  } catch (error) {
    console.error("Failed to fetch total funds disbursed:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch company payroll by ID
const fetchCompanyPayrollById = async () => {
  loading.value = true;
  try {
    const organisationId = Number(route.params.id);
    const response = await request(
      payrollStore.companyPayrollById(organisationId)
    );
    if (response?.data?.data?.pageItems) {
      payrollData.value = response.data.data.pageItems;
    }
  } catch (error) {
    console.error("Failed to fetch company payroll:", error);
  } finally {
    loading.value = false;
  }
};

// Prepare slip info and trigger PDF generation
const slipInfo = async (item: any) => {
  generatingPDF.value[item.payrollId] = true; // Start loading for this row

  // Prepare slip data without affecting the table display
  const tempSlip = {
    name: `${item.firstname ?? "Unknown"} ${item.lastname ?? ""}`,
    narration: item.narration,
    paymentDate: item.executionDate
      ? dateFormat(item.executionDate)
      : "--/--/----",
    grossPay: formatNumber(item.totalGrossPay),
    bonus: formatNumber(item.totalBonus),
    deductions: formatNumber(item.totalDeductions),
    tax: formatNumber(item.totalTaxAmount),
    netPay: formatNumber(item.totalNetPay),
  };

  // Wait for DOM update, then generate PDF
  await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure DOM updates
  exportToPDF(tempSlip, item.payrollId);
};

// Export to PDF
const exportToPDF = (tempSlip: any, payrollId: number) => {
  let element = document.getElementById("element-to-print");
  if (!element) {
    console.error("Element not found for PDF generation");
    generatingPDF.value[payrollId] = false; // Stop loading for this row
    return;
  }

  // Make the element visible temporarily for PDF generation
  // element.classList.remove("hidden");

  // // Update the contents of the hidden element
  // const pdfName = element.querySelector("#pdf-name");
  // const pdfNarration = element.querySelector("#pdf-narration");
  // const pdfPaymentDate = element.querySelector("#pdf-payment-date");
  // const pdfGrossPay = element.querySelector("#pdf-gross-pay");
  // const pdfBonus = element.querySelector("#pdf-bonus");
  // const pdfDeductions = element.querySelector("#pdf-deductions");
  // const pdfTax = element.querySelector("#pdf-tax");
  // const pdfNetPay = element.querySelector("#pdf-net-pay");

  // if (pdfName) pdfName.textContent = tempSlip.name;
  // if (pdfNarration) pdfNarration.textContent = tempSlip.narration;
  // if (pdfPaymentDate) pdfPaymentDate.textContent = tempSlip.paymentDate;
  // if (pdfGrossPay) pdfGrossPay.textContent = `₦${tempSlip.grossPay}`;
  // if (pdfBonus) pdfBonus.textContent = `₦${tempSlip.bonus}`;
  // if (pdfDeductions) pdfDeductions.textContent = `₦${tempSlip.deductions}`;
  // if (pdfTax) pdfTax.textContent = `₦${tempSlip.tax}`;
  // if (pdfNetPay) pdfNetPay.textContent = `₦${tempSlip.netPay}`;

  const opt = {
    margin: 10,
    filename: `payslip-${tempSlip.name}-${tempSlip.paymentDate}.pdf`,
    image: { type: "jpeg", quality: 1.5 },
    putOnlyUsedFonts: true,
    floatPrecision: 16,
    html2canvas: { scale: 4 }, // Ensure cross-origin images are rendered
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .then(() => {
      // Hide the element again after PDF generation
      element.classList.add("hidden");
      generatingPDF.value[payrollId] = false; // Stop loading after PDF is generated
    })
    .catch((error: any) => {
      console.error("Failed to generate PDF:", error);
      element.classList.add("hidden"); // Hide the element on error
      generatingPDF.value[payrollId] = false; // Stop loading on error
    });
};

function formatDate(dateString: string | number | Date) {
  if (!dateString) return "--/--";

  const date = new Date(dateString);
  const options = { year: "numeric" as const, month: "long" as const }; // Format to "Month Year"

  return date.toLocaleDateString("en-US", options);
}
</script>

<template>
  <div class="space-y-10 overflow-auto scrollbar-hide">
    <!-- Metrics Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border-grey border-t"
    >
      <!-- Metrics Cards -->
      <div class="bg-[#F0F2F2] shadow-lg rounded-lg p-6">
        <p class="text-black text-base font-medium">Total Funds Received</p>
        <h2 class="text-black text-xl font-bold pt-4">
          ₦ {{ totalFundReceived[0] ?? 0 }}
        </h2>
      </div>

      <!-- Card 2 -->
      <div class="bg-[#F0F2F2] shadow-lg rounded-lg p-6">
        <p class="text-black text-base font-medium">Funds Disbursed</p>
        <h2 class="text-black text-xl font-bold pt-4">
          ₦ {{ totalFundDisbursed[0] ?? 0 }}
        </h2>
      </div>

      <!-- Card 3 -->
      <div class="bg-[#F0F2F2] shadow-lg rounded-lg p-6">
        <p class="text-black text-base font-medium">Pending Disbursement</p>
        <h2 class="text-black text-xl font-bold pt-4">
          ₦ {{ pendingDisbursementData[0] ?? 0 }}
        </h2>
      </div>

      <!-- Card 4 -->
      <div class="bg-[#F0F2F2] shadow-lg rounded-lg p-6">
        <p class="text-black text-base font-medium">Revenue Received</p>
        <h2 class="text-black text-xl font-bold pt-4">
          ₦ {{ totalRevenueData[0] ?? 0 }}
        </h2>
      </div>
    </div>

    <!-- Loading Spinner -->
    <spinner
      v-if="loading"
      class="flex justify-center items-center lg:h-[400px] h-[300px]"
    />

    <!-- Empty State -->
    <EmptyState v-else-if="payrollData.length === 0">
      <template #icon><IUserThree /></template>
      <template #heading>Payment details</template>
      <template #desc>No payment found</template>
    </EmptyState>

    <!-- Payroll Table -->
    <div v-else class="w-full overflow-auto">
      <div class="overflow-hidden sm:rounded-lg">
        <table class="min-w-full table-fixed">
          <thead class="text-black-200 text-sm text-left">
            <tr class="whitespace-nowrap">
              <th scope="col" class="py-4 font-normal text-left">
                Payment Date
              </th>
              <th scope="col" class="py-4 font-normal text-left">Gross Pay</th>
              <th scope="col" class="py-4 font-normal text-left">Bonus</th>
              <th scope="col" class="py-4 font-normal text-left">Deductions</th>
              <th scope="col" class="py-4 font-normal text-left">Tax</th>
              <th scope="col" class="py-4 font-normal text-left">Net Pay</th>
              <th scope="col" class="py-4 font-normal text-left">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-grey-200">
            <tr
              v-for="payroll in payrollData"
              :key="payroll.payrollId"
              class="text-black-100"
            >
              <td class="py-4 whitespace-nowrap">
                <div class="text-left flex flex-col">
                  <span class="text-sm font-semimedium">
                    {{
                      payroll.scheduleDate !== "0001-01-01T00:00:00"
                        ? formatDate(payroll.scheduleDate)
                        : "--/--/---- --:-- --"
                    }}
                  </span>
                  <span class="text-xs text-gray-rgba-3"
                    >₦{{ formatNumber(payroll.totalBonus) || 0 }}</span
                  >
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="text-left flex flex-col">
                  <span class="text-sm font-semimedium">
                    {{
                      payroll.scheduleDate !== "0001-01-01T00:00:00"
                        ? dateFormat(payroll.executionDate)
                        : "--/--/---- --:-- --"
                    }}
                  </span>
                  <span class="text-xs text-gray-rgba-3">Direct deposit</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <span class="text-sm font-semimedium"
                    >₦{{ formatNumber(payroll.totalGrossPay) || 0 }}</span
                  >
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <span class="text-sm font-semimedium"
                    >₦{{ formatNumber(payroll.totalBonus) || 0 }}</span
                  >
                  <span class="text-xs text-gray-rgba-3">Commissions</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <span class="text-sm font-semimedium">
                    ₦{{ payroll.totalDeductions }}
                  </span>
                  <span class="text-xs text-gray-rgba-3">Pensions, Health</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <span class="text-sm font-semimedium">
                    ₦{{ payroll.totalTaxAmount }}
                  </span>
                  <span class="text-xs text-gray-rgba-3">PAYEE</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">₦{{ payroll.totalNetPay }}</td>
              <td class="py-4 whitespace-nowrap">
                <button
                  @click="slipInfo(payroll)"
                  :disabled="generatingPDF[payroll.payrollId]"
                  class="text-[#003b3d] bg-red-light text-sm px-4 py-2 rounded-full flex items-center justify-center"
                >
                  <span v-if="generatingPDF[payroll.payrollId]" class="mr-2">
                    <spinner class="w-4 h-4" />
                  </span>
                  {{
                    generatingPDF[payroll.payrollId]
                      ? "Downloading..."
                      : "Download Payslip"
                  }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Hidden Element for PDF Generation -->
      <div id="element-to-print" class="hidden">
        <h1 class="text-lg font-bold">Payslip</h1>
        <p>
          <strong>Name:</strong> <span id="pdf-name">{{ slip.name }}</span>
        </p>
        <p>
          <strong>Narration:</strong>
          <span id="pdf-narration">{{ slip.narration }}</span>
        </p>
        <p>
          <strong>Payment Date:</strong>
          <span id="pdf-payment-date">{{ slip.paymentDate }}</span>
        </p>
        <p>
          <strong>Gross Pay:</strong>
          <span id="pdf-gross-pay">₦{{ slip.grossPay }}</span>
        </p>
        <p>
          <strong>Bonus:</strong> <span id="pdf-bonus">₦{{ slip.bonus }}</span>
        </p>
        <p>
          <strong>Deductions:</strong>
          <span id="pdf-deductions">₦{{ slip.deductions }}</span>
        </p>
        <p>
          <strong>Tax:</strong> <span id="pdf-tax">₦{{ slip.tax }}</span>
        </p>
        <p>
          <strong>Net Pay:</strong>
          <span id="pdf-net-pay">₦{{ slip.netPay }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

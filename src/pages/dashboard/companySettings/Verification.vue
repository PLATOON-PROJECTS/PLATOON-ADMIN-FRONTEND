<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import KycStatusActions from "../../../components/kyc/KycStatusActions.vue";
import BusinessOwnerInfo from "../../../components/kyc/BussinessOwnerInfo.vue";
import BusinessOwnerInfoForm from "../../../components/kyc/BusinessOwnerInfoForm.vue";
import BusinessDocuments from "../../../components/kyc/BusinessDocuments.vue";
import UploadDocumentModal from "../../../components/kyc/UploadDocumentModal.vue";
import { request } from "../../../composables/request.composable";
import { useKycStore } from "../../../store/index";
import {
  KycDocument,
  KycInformation,
} from "src/service/kyc/interface/kyc.interface";

const loading = ref(false);
interface KycData {
  status: string;
  information: KycInformation;
  documents: KycDocument[];
}

const kycData = ref<KycData | null>(null);
const route = useRoute();
const kycStore = useKycStore();
const showModal = ref(false);

const fetchCompaniesKyc = async () => {
  loading.value = true;
  try {
    const response = await request(
      kycStore.fetchKycDetails(Number(route.params.id))
    );
    kycData.value = response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching KYC:", error);
  } finally {
    loading.value = false;
  }
};

const handleInfoSubmitted = () => {
  // Refresh KYC data after info is submitted
  fetchCompaniesKyc();
};

onMounted(fetchCompaniesKyc);
</script>
<template>
  <!-- ✅ When data is loaded and present -->
  <section v-if="!loading && kycData" class="px-8 py-6 space-y-10 bg-white">
    <KycStatusActions
      :status="kycData.status"
      @open-upload="showModal = true"
    />
    <BusinessOwnerInfo :info="kycData.information" />
    <BusinessDocuments
      :documents="kycData.documents"
      @open-upload="showModal = true"
    />
    <UploadDocumentModal v-model="showModal" />
  </section>

  <!-- ✅ Empty state with actual sections -->
  <section
    v-else-if="!loading && !kycData"
    class="px-8 py-6 space-y-10 bg-white"
  >
    <div class="space-y-4 border border-[#EDEDED] rounded-lg p-6 bg-white">
      <h2 class="text-xl font-semibold text-gray-700 mb-2">KYC Verification</h2>
      <p class="text-gray-500 mb-6">
        Please complete the KYC verification process by providing your business
        owner information and uploading required documents.
      </p>
    </div>

    <BusinessOwnerInfoForm @info-submitted="handleInfoSubmitted" />

    <BusinessDocuments :documents="[]" @open-upload="showModal = true" />

    <UploadDocumentModal v-model="showModal" />
  </section>

  <!-- ✅ Optional loading spinner -->
  <section v-else class="flex items-center justify-center py-20">
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#306651]"
    ></div>
  </section>
</template>

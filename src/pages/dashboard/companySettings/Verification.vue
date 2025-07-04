<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import KycStatusActions from "../../../components/kyc/KycStatusActions.vue";
import BusinessOwnerInfo from "../../../components/kyc/BussinessOwnerInfo.vue";
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

  <!-- ✅ Empty state fallback -->
  <section
    v-else-if="!loading && !kycData"
    class="px-8 py-20 flex flex-col items-center justify-center text-center bg-white"
  >
    <h2 class="text-xl font-semibold text-gray-700 mb-2">No KYC Data Found</h2>
    <p class="text-gray-500 mb-6">
      It looks like there’s no KYC record for this organisation yet.
    </p>
    <!-- <button
      @click="showModal = true"
      class="bg-[#306651] text-white px-6 py-3 rounded-full hover:bg-green-700 text-sm font-medium"
    >
      Upload Document
    </button> -->

    <!-- Modal still works here -->
    <!-- <UploadDocumentModal v-model="showModal" /> -->
  </section>

  <!-- ✅ Optional loading spinner -->
  <section v-else class="flex items-center justify-center py-20">
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#306651]"
    ></div>
  </section>
</template>

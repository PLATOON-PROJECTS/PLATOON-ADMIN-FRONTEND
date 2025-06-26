<template>
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
</template>

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
  // Add other properties as needed
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

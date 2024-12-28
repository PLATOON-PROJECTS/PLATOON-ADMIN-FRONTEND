<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";
import IBuildings from "../../components/icons/IBuildings.vue";
import IUser from "../../components/icons/IUser.vue";
import IEyeOpened from "../../components/icons/IEyeOpened.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import handleSuccess from "../../composables/handle_success.composable";
import handleError from "../../composables/handle_error.composable";
import { useAuthStore, useUserStore } from "../../store/index";
import spinner from "../../components/timer/Spinner.vue";
import { stringValidate, numberValidate } from "../../validations/validate";

//: TODO company should be removed
// initialize router
const router = useRouter();
// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

enum Password {
  PASSWORD = "password",
  TEXT = "text",
}
// variables
const passwordType = ref<Password>(Password.PASSWORD);
const confirmPasswordType = ref<Password>(Password.PASSWORD);
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({ message: "Signup successful" });
const valid = ref(false);
const invalidDomain = ref(false);

const data = reactive<{
  email: string | null;
  company: string | null;
  // company: { name: string };
  password: string | null;
}>({
  email: "",
  company: "",
  // company: { name: "" },
  password: "",
});

async function checkDomainExists(email:string | null) {
  const domain = email?.split('@')[1];
  try {
    const response = await fetch(`https://${domain}`, { mode: 'no-cors' });
    return true; // Returns true if the domain exists
  } catch (error) {
    return false; // Returns false if there's an error or domain doesn't exist
  }
}

// methods
const handleRegister = async (): Promise<void> => {
  // check if form is formatted correctly

  const isFormCorrect = await v$.value.$validate();
  invalidDomain.value = false;

  if (isFormCorrect == true) {
    // const data = {
    //   telephone: v$.value.telephone.$model as number,
    //   email: v$.value.email.$model as string,
    //   password: v$.value.password.$model as string,
    //   confirmPassword: v$.value.confirmPassword.$model as string,
    //   firstname: v$.value.firstname.$model as string,
    //   lastname: v$.value.lastname.$model as string,
    //   // company: { name: v$.value.company.name.$model as string },
    // };

    const data = {
      email: v$.value.email.$model as string,
      company: v$.value.company.$model as string,
      // company: { name: v$.value.company.name.$model as string },
      password: v$.value.password.$model as string,
    };
    console.log("Data to be sent:", data);

    loading.value = true;
    // const is_alive = await checkDomainExists(data.email)
    // .then((result: any) => {
    //   if (result) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // })
    // .catch(error => {
    //   return "Not yet ready";
    // });
    // const is_alive = true;

    // if(){
      const response = await request(authStore.userRegister(data), loading);
      console.log("Response from API:", response);

      handleError(response, userStore);
  
      const successResponse = handleSuccess(response, showSuccess);
  
      if (successResponse && typeof successResponse !== "undefined") {
        responseData.value = successResponse;
  
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      }
    // }else{
    //   loading.value = false;
    //   invalidDomain.value = true;
    // }
  }
};

// const stringValidation = () => stringValidate(data.company.name);

const validatePhone = () => {
  return valid.value;
};

const togglePasswordState = (type: string) => {
  if (type === "password") {
    passwordType.value === Password.PASSWORD
      ? (passwordType.value = Password.TEXT)
      : (passwordType.value = Password.PASSWORD);
  } else {
    confirmPasswordType.value === Password.PASSWORD
      ? (confirmPasswordType.value = Password.TEXT)
      : (confirmPasswordType.value = Password.PASSWORD);
  }
};

// validations rule
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Email address is required", required),
      email: helpers.withMessage("Must be a valid email", email),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
      min: helpers.withMessage(
        "Password cannot be less than 8 characters",
        minLength(8)
      ),
    },

    company: {
      // name: {
        required: helpers.withMessage("Company name  is required", required),
      // },
      // stringValidate: helpers.withMessage(
      //   "company name can only include alphabets",
      //   stringValidation as any
      // ),
    },
  };
});

const v$ = useVuelidate(rules as any, data);

const gotoExternalRouteOnTab = (route:string) => {
    window.location.href = route;
}
</script>
<template>
  <!--  -->
  <div class="lg:w-[456px] w-screen mx-auto h-full pt-18 relative">
    <successAlert
      v-if="showSuccess == true"
      @closeSuccess="showSuccess = false"
      :showSuccess="showSuccess"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}
    </successAlert>
    <div class="space-y-8">
      <div class="space-y-2">
        <h4 class="text-2xl+4">Get started with Platoon</h4>
        <p>Fill in your details below to create an account</p>
      </div>
      <!-- <div class="space-y-2">
        <div
          class="flex items-center bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <img src="/images/png/google.png" alt="Google" />
          <span class="text-sm">Continue with Google</span>
        </div>

        <div
          class="flex items-center bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <img src="/images/png/apple.png" alt="Apple" />
          <span class="text-sm">Continue with Apple</span>
        </div>
      </div> -->
    </div>
    <!-- <div class="flex gap-4 mt-3">

        <button type="button"
          class="flex items-center justify-center w-full bg-[#003b3d] text-white py-3 px-6 rounded-full space-x-24 cursor-default"
        >
          <span class="text-sm">Register As Company</span>
        </button>
        <button type="button"
          @click="gotoExternalRouteOnTab('https://employee.platoonco.com/')"
          class="flex items-center justify-center w-full bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <span class="text-sm">Register As Employee</span>
        </button>
      </div>

    <div class="flex items-center justify-center pt-8-2">
      <div class="divider-local flex-1"></div>
      <span class="p-1.5 uppercase text-xs text-grey-rgba">or</span>
      <div class="divider-local flex-1"></div>
    </div> -->

    <!-- form -->
    <form @submit.prevent="handleRegister" class="pt-9+2 space-y-6">
      <div class="space-y-4">
        <div class="relative">
          <input
            type="email"
            v-model="data.email"
            id="Email"
            maxlength="55"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Email"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Email</label
          >
          <span class="absolute right-4 top-4+2">
            <IUser />
          </span>
        </div>
        <div v-if="v$.email.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.email.$errors[0].$message }}
        </div>
        <div v-if="invalidDomain" class="!text-red-100 text-xs">
          Invalid Email Address.
        </div>

        <div class="relative">
          <input type="text" v-model="data.company" id="company_name" maxlength="55"
            class="input-float peer pr-10.5" placeholder="" />
          <label for="company_name"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
            Company Name</label>
          <span class="absolute right-4 top-4+2">
            <IBuildings />
          </span>
          <div v-if="v$.company.$error" class="text-red-600 text-xs">
            {{ "* " + v$.company.$errors[0].$message }}
          </div>
        </div>

        <div class="relative">
          <input
            :type="passwordType"
            id="password"
            v-model="data.password"
            maxlength="54"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Password"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Password</label
          >
          <span class="absolute right-4 top-4+2 cursor-pointer">
            <IEyeOpened @click="togglePasswordState('password')" />
          </span>
        </div>
        <div v-if="v$.password.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.password.$errors[0].$message }}
        </div>

      </div>

      <!-- button -->
      <button
        :disabled="loading"
        class="bg-[#003b3d] flex items-start justify-center py-4 rounded-full text-white w-full text-sm"
      >
        <spinner v-if="loading == true" /> <span v-else>Create account</span>
      </button>
    </form>

    <div class="mt-6">
      <p class="text-sm">
        By Signing up, you accept our<a href="/" class="!text-[#003b3d] link-underline">
          Terms</a
        >,
        <a href="/" class="!text-[#003b3d] link-underline">Privacy Policy</a>
        and
        <a href="/" class="!text-[#003b3d] link-underline">Cookie Use</a>.
      </p>
    </div>

    <div class="mt-20 pb-20">
      <p>
        Already have an account?
        <button
          @click="router.push('/login')"
          class="text-[#003b3d] underline underline-offset-4 font-semimedium"
          >Login</button
        >
      </p>
    </div>
  </div>
  <!--  -->
</template>
<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>
























<!-- <script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";
import IBuildings from "../../components/icons/IBuildings.vue";
import IUser from "../../components/icons/IUser.vue";
import IEyeOpened from "../../components/icons/IEyeOpened.vue";
import SuccessAlert from "../../components/alerts/SuccessAlert.vue";
import { request } from "../../composables/request.composable";
import handleSuccess from "../../composables/handle_success.composable";
import handleError from "../../composables/handle_error.composable";
import { useAuthStore, useUserStore } from "../../store/index";
import spinner from "../../components/timer/Spinner.vue";
import { stringValidate, numberValidate } from "../../validations/validate";

//: TODO company should be removed
// initialize router
const router = useRouter();
// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

enum Password {
  PASSWORD = "password",
  TEXT = "text",
}
// variables
const passwordType = ref<Password>(Password.PASSWORD);
const confirmPasswordType = ref<Password>(Password.PASSWORD);
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({ message: "Signup successful" });
const valid = ref(false);
const invalidDomain = ref(false);

const data = reactive<{
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  telephone: string | null;
  firstname: string | null;
  lastname: string | null;
  // company: { name: string };
}>({
  email: null,
  password: null,
  confirmPassword: null,
  firstname: null,
  telephone: "",
  lastname: null,
  // company: { name: "" },
});

async function checkDomainExists(email:string | null) {
  const domain = email?.split('@')[1];
  try {
    const response = await fetch(`https://${domain}`, { mode: 'no-cors' });
    return true; // Returns true if the domain exists
  } catch (error) {
    return false; // Returns false if there's an error or domain doesn't exist
  }
}

// methods
const handleRegister = async (): Promise<void> => {
  // check if form is formatted correctly

  const isFormCorrect = await v$.value.$validate();
  invalidDomain.value = false;

  if (isFormCorrect == true) {
    // const data = {
    //   telephone: v$.value.telephone.$model as number,
    //   email: v$.value.email.$model as string,
    //   password: v$.value.password.$model as string,
    //   confirmPassword: v$.value.confirmPassword.$model as string,
    //   firstname: v$.value.firstname.$model as string,
    //   lastname: v$.value.lastname.$model as string,
    //   // company: { name: v$.value.company.name.$model as string },
    // };

    const data = {
      email: v$.value.email.$model as string,
      company: { name: v$.value.company.name.$model as string },
      password: v$.value.password.$model as string,
    };


    loading.value = true;
    const is_alive = await checkDomainExists(data.email)
    .then((result: any) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      return "Not yet ready";
    });

    if(is_alive){
      const response = await request(authStore.userRegister(data), loading);
      handleError(response, userStore);
  
      const successResponse = handleSuccess(response, showSuccess);
  
      if (successResponse && typeof successResponse !== "undefined") {
        responseData.value = successResponse;
  
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      }
    }else{
      loading.value = false;
      invalidDomain.value = true;
    }
  }
};

// const stringValidation = () => stringValidate(data.company.name);

const onInput = (phone: number, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.telephone = phoneObject.number;
    valid.value = phoneObject.valid;
  }
};

const validatePhone = () => {
  return valid.value;
};

const togglePasswordState = (type: string) => {
  if (type === "password") {
    passwordType.value === Password.PASSWORD
      ? (passwordType.value = Password.TEXT)
      : (passwordType.value = Password.PASSWORD);
  } else {
    confirmPasswordType.value === Password.PASSWORD
      ? (confirmPasswordType.value = Password.TEXT)
      : (confirmPasswordType.value = Password.PASSWORD);
  }
};

// // validations rule
// const rules = computed(() => {
//   return {
//     email: {
//       required: helpers.withMessage("Email address is required", required),
//       email: helpers.withMessage("Must be a valid email", email),
//     },
//     firstname: {
//       required: helpers.withMessage("First name is required", required),
//       stringValidate: helpers.withMessage(
//         "First name can only include alphabets",
//         () => stringValidate(data.firstname as string) as any
//       ),
//     },
//     lastname: {
//       required: helpers.withMessage("Last name is required", required),
//       stringValidate: helpers.withMessage(
//         "Last name can only include alphabets",
//         () => stringValidate(data.lastname as string) as any
//       ),
//     },
//     telephone: {
//       required: helpers.withMessage("Telephone is required", required),
//       validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
//     },

//     confirmPassword: {
//       sameAsPassword: sameAs(data.password, "password"),
//     },
//     password: {
//       required: helpers.withMessage("Password is required", required),
//       min: helpers.withMessage(
//         "Password cannot be less than 8 characters",
//         minLength(8)
//       ),
//     },

//     // company: {
//     //   name: {
//     //     required: helpers.withMessage("Company name  is required", required),
//     //   },
//     //   stringValidate: helpers.withMessage(
//     //     "company name can only include alphabets",
//     //     stringValidation as any
//     //   ),
//     // },
//   };
// });

// const v$ = useVuelidate(rules as any, data);

// const gotoExternalRouteOnTab = (route:string) => {
//     window.location.href = route;
// }
// </script>
// <template>
  //   -->
  <!-- <div class="lg:w-[456px] w-screen mx-auto h-full pt-18 relative">
    <successAlert
      v-if="showSuccess == true"
      @closeSuccess="showSuccess = false"
      :showSuccess="showSuccess"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}
    </successAlert>
    <div class="space-y-8">
      <div class="space-y-2">
        <h4 class="text-2xl+4">Get started with Platoon</h4>
        <p>Fill in your details below to create an account</p>
      </div> -->
      <!-- <div class="space-y-2">
        <div
          class="flex items-center bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <img src="/images/png/google.png" alt="Google" />
          <span class="text-sm">Continue with Google</span>
        </div>

        <div
          class="flex items-center bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <img src="/images/png/apple.png" alt="Apple" />
          <span class="text-sm">Continue with Apple</span>
        </div>
      </div> -->
    <!-- </div> -->
    <!-- <div class="flex gap-4 mt-3">

        <button type="button"
          class="flex items-center justify-center w-full bg-[#003b3d] text-white py-3 px-6 rounded-full space-x-24 cursor-default"
        >
          <span class="text-sm">Register As Company</span>
        </button>
        <button type="button"
          @click="gotoExternalRouteOnTab('https://employee.platoonco.com/')"
          class="flex items-center justify-center w-full bg-grey py-3 px-6 rounded-full space-x-24"
        >
          <span class="text-sm">Register As Employee</span>
        </button>
      </div>

    <div class="flex items-center justify-center pt-8-2">
      <div class="divider-local flex-1"></div>
      <span class="p-1.5 uppercase text-xs text-grey-rgba">or</span>
      <div class="divider-local flex-1"></div>
    </div> -->

    <!-- form -->
    <!-- <form @submit.prevent="handleRegister" class="pt-9+2 space-y-6">
      <div class="space-y-4">
        <div class="relative">
          <input
            type="email"
            v-model="data.email"
            id="Email"
            maxlength="55"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Email"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Email</label
          >
          <span class="absolute right-4 top-4+2">
            <IUser />
          </span>
        </div>
        <div v-if="v$.email.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.email.$errors[0].$message }}
        </div>
        <div v-if="invalidDomain" class="!text-red-100 text-xs">
          Invalid Email Address.
        </div>

        <div class="relative">
          <input
            type="text"
            id="FirstName"
            v-model="data.firstname"
            maxlength="55"
            class="input-float text-black peer pr-10.5"
            placeholder=""
          />
          <label
            for="Firstame"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            First name</label
          >
        </div>
        <div v-if="v$.firstname.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.firstname.$errors[0].$message }}
        </div>

        <div class="relative">
          <input
            type="text"
            id="LastName"
            v-model="data.lastname"
            maxlength="55"
            class="input-float text-black peer pr-10.5"
            placeholder=""
          />
          <label
            for="LastName"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Last name</label
          >
        </div>
        <div v-if="v$.lastname.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.lastname.$errors[0].$message }}
        </div>
        <div class="relative">
          <vue-tel-input
            :value="data.telephone"
            @input="onInput"
            class="text-black text-sm border py-2 telinput"
          ></vue-tel-input>
          <label
            for="Telephone"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Telephone</label
          >
        </div>
        <div v-if="v$.telephone.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.telephone.$errors[0].$message }}
        </div> -->

        <!-- <div class="relative">
          <input type="text" v-model="data.company.name" id="company_name" maxlength="55"
            class="input-float peer pr-10.5" placeholder="" />
          <label for="company_name"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2">
            Company Name</label>
          <span class="absolute right-4 top-4+2">
            <IBuildings />
          </span>
          <div v-if="v$.company.$error" class="text-red-600 text-xs">
            {{ "* " + v$.company.$errors[0].$message }}
          </div>
        </div> -->

        <!-- <div class="relative">
          <input
            :type="passwordType"
            id="password"
            v-model="data.password"
            maxlength="54"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Password"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Password</label
          >
          <span class="absolute right-4 top-4+2 cursor-pointer">
            <IEyeOpened @click="togglePasswordState('password')" />
          </span>
        </div>
        <div v-if="v$.password.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.password.$errors[0].$message }}
        </div> -->
<!-- 
        <div class="relative">
          <input
            :type="confirmPasswordType"
            id="confirmPassword"
            v-model="data.confirmPassword"
            maxlength="54"
            class="input-float peer pr-10.5"
            placeholder=""
          />
          <label
            for="Password"
            class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
          >
            Confirm Password</label
          >
          <span class="absolute right-4 top-4+2 cursor-pointer">
            <IEyeOpened @click="togglePasswordState('confirmPassword')" />
          </span>
        </div>
        <div v-if="v$.confirmPassword.$error" class="!text-red-100 text-xs">
          {{ "* " + v$.confirmPassword.$errors[0].$message }}
        </div>
      </div> -->

      <!-- button -->
      <!-- <button
        :disabled="loading"
        class="bg-[#003b3d] flex items-start justify-center py-4 rounded-full text-white w-full text-sm"
      >
        <spinner v-if="loading == true" /> <span v-else>Create account</span>
      </button>
    </form>

    <div class="mt-6">
      <p class="text-sm">
        By Signing up, you accept our<a href="/" class="!text-[#003b3d] link-underline">
          Terms</a
        >,
        <a href="/" class="!text-[#003b3d] link-underline">Privacy Policy</a>
        and
        <a href="/" class="!text-[#003b3d] link-underline">Cookie Use</a>.
      </p>
    </div>

    <div class="mt-20 pb-20">
      <p>
        Already have an account?
        <button
          @click="$router.push('/login')"
          class="text-[#003b3d] underline underline-offset-4 font-semimedium"
          >Login</button
        >
      </p>
    </div>
  </div>
  <!  -->
<!-- </template>
<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>  -->



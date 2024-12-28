<template>
    <div>
      <vue-tel-input
        :value="phone"
        :defaultCountry="mappedCountryCode"
        @input="onPhoneInput"
        class="text-black text-sm border py-2 telinput"
      />
      <label
        for="phone"
        class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
      >
        Phone Number
      </label>
    </div>
  </template>
  
  <script>
  import VueTelInput from 'vue-tel-input';
  
  const countryCodeMap = {
  "1": "US",    // United States
  "44": "GB",   // United Kingdom
  "234": "NG",  // Nigeria
  "91": "IN",   // India
  "61": "AU",   // Australia
  "81": "JP",   // Japan
  "33": "FR",   // France
  "49": "DE",   // Germany
  "55": "BR",   // Brazil
  "86": "CN",   // China
  "7": "RU",    // Russia
  "39": "IT",   // Italy
  "27": "ZA",   // South Africa
  "34": "ES",   // Spain
  "52": "MX",   // Mexico
  "82": "KR",   // South Korea
  "351": "PT",  // Portugal
  "31": "NL",   // Netherlands
  "65": "SG",   // Singapore
  "41": "CH",   // Switzerland
  // Add more country codes as needed
};

  
  export default {
    name: "PhoneInput",
    components: {
      VueTelInput,
    },
    props: {
      phone: {
        type: String,
        required: true
      },
      countryCode: {
        type: String,
        required: true
      }
    },
    computed: {
      mappedCountryCode() {
        return countryCodeMap[this.countryCode] || "NG"; // Default to "NG" if not found
      }
    },
    methods: {
      onPhoneInput(value) {
        this.$emit("input", value); // Emit the input event for two-way data binding
      }
    }
  };
  </script>
  
  <style scoped>
  .telinput {
    width: 100%;
  }
  </style>
  
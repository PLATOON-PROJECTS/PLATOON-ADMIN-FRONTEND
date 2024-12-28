import Axios from 'axios';
import { useUserStore } from '../../store';
import errorType from '../../constants/ErrorTypes';
import * as errorBody from '../../constants/ErrorBody';
import authStore from '../../store/modules/auth.store';

// create an new axios http instance
const http = Axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   Accept: "*/*",
  // },
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

http.defaults.headers.common.accept = 'application/json';

let store: any;

// before a request is made start  anything
http.interceptors.request.use((config) => {
  store = useUserStore();
  return config;
});

// before a response is returned do anything
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.data.message ===
        'Access Denied! This action is unauthorized.'
    ) {
      store.error.type = errorType.authError;
      store.error.message = ' Session expired or action unauthorized.';
      store.error.value = true;
      sessionStorage.removeItem(import.meta.env.VITE_ACCESSTK);

      setTimeout(() => {
        return ((window.location as unknown as string) = '/');
      }, 3000);
    }
    return error;
  }
);

const base_url = http.defaults.baseURL;

export { http, base_url };


/** =================================================== **/


// import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { useUserStore } from '../../store';
// import errorType from '../../constants/ErrorTypes';
// import * as errorBody from '../../constants/ErrorBody';
// import authStore from '../../store/modules/auth.store';

// // Create a new Axios HTTP instance
// const http = Axios.create({
//   baseURL: import.meta.env.VITE_BASEURL,
//   headers: {
//     'X-Requested-With': 'XMLHttpRequest',
//     'Accept': 'application/json',
//   },
// });

// // Request interceptor
// http.interceptors.request.use((config: AxiosRequestConfig) => {
//   const store = useUserStore();
  
//   // Add authorization token if available
//   const token = store.token; // Assuming token is managed in user store
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }

//   return config;
// });

// // Response interceptor
// http.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   (error: AxiosError) => {
//     const store = useUserStore();

//     if (error.response) {
//       const { status, data } = error.response;

//       // Handle specific status codes
//       if (status === 401) {
//         store.error.type = errorType.authError;
//         store.error.message = 'Session expired or action unauthorized.';
//         store.error.value = true;
//         sessionStorage.removeItem(import.meta.env.VITE_ACCESSTK);

//         setTimeout(() => {
//           window.location.href = '/'; // Redirect to login or home
//         }, 3000);
//       } else if (status === 403) {
//         store.error.type = errorType.authError;
//         store.error.message = 'Access Denied! You do not have permission.';
//         store.error.value = true;
//       } else {
//         // Handle other error types
//         store.error.type = errorType.genericError;
//         store.error.message = data.message || 'An error occurred.';
//         store.error.value = true;
//       }
//     }

//     return Promise.reject(error); // Reject the promise with the error
//   }
// );

// const base_url = http.defaults.baseURL;

// export { http, base_url };

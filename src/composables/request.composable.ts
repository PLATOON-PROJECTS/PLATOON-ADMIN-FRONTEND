// imports
import { ref } from "vue";

export const request = (store: any, state?: { value: boolean }): any => {

  return store
    .then((res: any) => {
      if (state) {
        state.value = false;
      }
      return res;
    })
    .catch((err: any) => {
      if (state) {
        state.value = false;
      }
      return err;
    });
};

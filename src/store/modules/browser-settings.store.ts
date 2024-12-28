import { defineStore } from 'pinia';
import { useDark } from '@vueuse/core';

interface State {
  isDarkModeOn: boolean;
  isClosedAuthSide: boolean;
}

const browserStore = defineStore('browser-settings', {
  state: (): State => ({
    isDarkModeOn: false, //<boolean>useDark().value,
    isClosedAuthSide: false,
  }),
});

export default browserStore;

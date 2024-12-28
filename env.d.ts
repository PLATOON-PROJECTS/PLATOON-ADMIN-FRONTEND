import { readonly } from "vue";

interface ImportMetaEnv {
  readonly VITE_BASEURL: string;
  readonly VITE_PASSPHRASE: string;
  readonly VITE_ACCESSTK: string;
  readonly VITE_ACCESSTOKEN: string;
  readonly VITE_USERDETAILS: string;
  readonly VITE_USERID: string;
  readonly VITE_GOOGLE_CLIENT_ID:string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

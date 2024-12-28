import CryptoJS from "crypto-js";
import { getKey } from "../helpers/get_key";

const cipher = (text: string) => {
  const passphrase = getKey.apply(this);
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decipher = (ciphertext: string) => {
  const passphrase = getKey.apply(this);
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

export { cipher, decipher };

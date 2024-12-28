import { cipher, decipher } from "./enc";

function storeItem(key: string, item: any) {
  var itemString = JSON.stringify(item);

  const encripted = cipher(itemString);

  sessionStorage.setItem(key, encripted);
}

function getItem(key: string) {
  // console.log("fired");
  if (sessionStorage.getItem(key)) {
    const deciper: string | null = sessionStorage.getItem(key);

    const data = decipher(deciper as string);

    var parsed = JSON.parse(data);

    return parsed;
  }

  return "";
}

export { getItem, storeItem };

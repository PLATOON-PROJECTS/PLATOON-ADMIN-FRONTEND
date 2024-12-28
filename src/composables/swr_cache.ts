const cache = (key: string, data?: any) => {
  // console.log("cached fired", key);
  const isCached = sessionStorage.getItem(key);
 
  if (isCached) {
    if (data) {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
    return JSON.parse(isCached);
  } else {
    if (data) {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  }
};
export default cache;

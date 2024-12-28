import errorType from "../constants/ErrorTypes";
import * as errorBody from "../constants/ErrorBody";

const handleError = (response: any, store: any) => {
  const errValueArr = Object.values(errorBody);
  const errKeyArr = Object.keys(errorBody);
  let key: any;
  if (
    response &&
    typeof response.data !== "undefined" &&
    response.data.status &&
    !response.data.status.toString().startsWith("2")
  ) {
    for (let i = 0; i < errValueArr.length; i++) {
      if (errValueArr[i].messages.includes(response.data.message)) {
        // console.log(response.data.message, true, errKeyArr[i]);
        key = errKeyArr[i];
        store.error.type = errorType[key as keyof Object];
        store.error.message = response.data.message;
        store.error.value = true;
        return;
      }
    }

    for (let i = 0; i < errValueArr.length; i++) {
      if (errValueArr[i].statusCode.includes(response.data.status)) {
        const key = errKeyArr[i];
        // console.log(store.error);
        store.error.type = errorType[key as keyof Object];
        store.error.message = response.data.message;

        store.error.value = true;
        return;
      }
    }
  } else if (
    response &&
    typeof response.data !== "undefined" &&
    !response.status.toString().startsWith("2")
  ) {
    for (let i = 0; i < errValueArr.length; i++) {
      if (errValueArr[i].statusCode.includes(response.status)) {
        const key = errKeyArr[i];
        store.error.type = errorType[key as keyof Object];
        store.error.message =
          "...Ooops,sorry but the server could not fulfil your request at this time,please try again at a later time";

        store.error.value = true;
        break;
      }
    }
  } else if (response && typeof response.data === "undefined") {
    console.log(response);
    store.error.type = errorType.technicalError;
    store.error.message =
      " you seem to be offline. Connect to an internet and try again";
    store.error.value = true;
    return;
  }else if (response && response.data.status === 500) {
    store.error.type = "Invalid Header";
    store.error.message = "you";
    store.error.value = true;
    return;
  } else {
    return;
  }
};
export default handleError;

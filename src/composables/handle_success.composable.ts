const handleSuccess = (response: any, showSuccess?: { value: boolean }) => {
  if (
    response &&
    response.data &&
    response.status &&
    response.status.toString().startsWith("20")
  ) {
    showSuccess ? (showSuccess.value = true) : " ";
    // console.log(response.status);
    return {
      data: response.data,
      message: response.data.message
        ? response.data.message
        : "Action successful",
    };
  } else {
    return;
  }
};
export default handleSuccess;

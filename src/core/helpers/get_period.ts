const getPeriod = () => {
  var today = new Date();
  var curHr = today.getHours();

  if (curHr < 12) {
    return "good morning";
  } else if (curHr < 16) {
    return "good afternoon";
  } else {
    return "good evening";
  }
};
export default getPeriod;

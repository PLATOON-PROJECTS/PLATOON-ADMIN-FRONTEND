import moment from "moment";

export const stringValidate = (field: any) => {
  if (field) {
    return /^[a-zA-Z]+$/.test(field);
  } else {
    return true;
  }
};

export const numberValidate = (field: any) => {
  if (field) {
    return /^[0-9]+$/.test(field);
  } else {
    return true;
  }
};

export const dateValidateGreaterOrEqual = (fieldOne: any, fieldTwo: any) => {
  if (fieldOne === "" || fieldTwo === "") {
    return true;
  }
  return new Date(fieldOne).getTime() >= new Date(fieldTwo).getTime();
};
export const dateValidateGreater = (fieldOne: any, fieldTwo: any) => {
  if (fieldOne === "" || fieldTwo === "") {
    return true;
  }
  return new Date(fieldOne).getTime() > new Date(fieldTwo).getSeconds();
};

export const dateValidateLesserOrEqual = (fieldOne: Date, fieldTwo: any) => {
  if (!fieldOne || !fieldTwo) {
    return true;
  }

  const dte = new Date(Date.now()).toLocaleDateString();
  const newField = new Date(fieldTwo).toLocaleDateString();

  if (dte === newField) {
    return true;
  } else if (fieldOne.getTime() < new Date(fieldTwo).getTime()) {
    return true;
  } else {
    return false;
  }
};

type TextObject = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordInvalid: string;
  passwordsDontMatch: string;
  requiredField: string;
};

export const validateRequiredField = (value: string, text: TextObject) => {
  let error = "";
  if (value.trim() === "") error = text.requiredField;
  return error;
};

export const validateEmail = (email: string, text: TextObject) => {
  let error = "";
  if (email === "") {
    error = text.emailRequired;
  } else if (!email.match(/^\S+@\S+\.\S+$/)) {
    error = text.emailInvalid;
  }
  return error;
};

export const isValidEmail = (email: string) => {
  if (email.trim() === "" || !email.match(/^\S+@\S+\.\S+$/)) return false;
  return true;
};

export const isValid = (value: string) => {
  if (value.trim() === "") return false;
  return true;
};

export const isValidPassword = (password: string) => {
  if (
    password === "" ||
    !password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/gm
    )
  )
    return false;
  return true;
};

export const passwordsMatch = (password1: string, password2: string) => {
  return password1 === password2;
};

export const validateSecondPassword = (
  secondPassword: string,
  password: string,
  text: TextObject
) => {
  let error = "";
  if (secondPassword !== password) error = text.passwordsDontMatch;
  return error;
};

export const passwordEntered = (password: string, text: TextObject) => {
  return password === "" ? text.passwordRequired : "";
};

export const validatePassword = (password: string, text: TextObject) => {
  let error = "";
  if (password === "") error = text.passwordRequired;
  else if (
    !password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/gm
    )
  ) {
    error = text.passwordInvalid;
  }
  return error;
};

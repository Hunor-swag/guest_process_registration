import {
  isValid,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from "./validations";
import { Id, ToastItem, toast } from "react-toastify";

type Params = {
  email: string;
  hotel_name: string;
  contact_phone: string;
  contact_name: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
  privacy_policies: boolean;
};

export function displayToasts({
  email,
  hotel_name,
  contact_phone,
  contact_name,
  password,
  password_confirmation,
  terms,
  privacy_policies,
}: Params) {
  if (!isValidEmail(email)) displayErrorToast("Invalid Email");
  if (!isValid(hotel_name)) displayErrorToast("Invalid Hotel Name");
  if (!isValid(contact_phone)) displayErrorToast("Invalid Phone Number");
  if (!isValid(contact_name)) displayErrorToast("Invalid Contact Name");
  if (!isValidPassword(password)) displayErrorToast("Invalid Password");
  if (!passwordsMatch(password, password_confirmation))
    displayErrorToast("Passwords do not match");
  if (!terms) displayErrorToast("Please accept the terms and conditions");
  if (!privacy_policies)
    displayErrorToast("Please accept the privacy policies");
}

export function displayErrorToast(message: string) {
  toast(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    type: "error",
  });
}
export function displaySuccessToast(message: string) {
  toast(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    type: "success",
  });
}

export function displayLoadingToast(message: string) {
  return toast(message, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    type: "info",
  });
}

export function closeLoadingToast(toastId: Id) {
  toast.dismiss(toastId);
}

"use client";

import { FocusEvent, FormEvent, useRef, useState } from "react";
import useDictionary from "@/hooks/useDictionary";
import Link from "next/link";
import {
  isValid,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
  validateEmail,
  validatePassword,
  validateRequiredField,
  validateSecondPassword,
} from "@/functions/validations";
import Input from "./Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  closeLoadingToast,
  displayErrorToast,
  displayLoadingToast,
  displaySuccessToast,
  displayToasts,
} from "@/functions/displayToasts";
import { useRouter } from "next/navigation";
// import ErrorDialog from "@/components/ErrorDialog";

export default function RegisterSystem() {
  const router = useRouter();

  const defaultObject = { value: "", error: "" };
  const [values, setValues] = useState({
    hotel_name: defaultObject,
    contact_name: defaultObject,
    email: defaultObject,
    contact_phone: defaultObject,
    password: defaultObject,
    password_confirmation: defaultObject,
    terms: { value: false, error: "" },
    privacy_policies: { value: false, error: "" },
  });

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const errorDialogRef = useRef<HTMLDialogElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: { ...[name], value: e.target.value },
    }));
  };

  const dict = useDictionary();

  const validate = () => {
    return (
      isValidEmail(values.email.value) &&
      isValid(values.hotel_name.value) &&
      isValid(values.contact_phone.value) &&
      isValid(values.contact_name.value) &&
      isValidPassword(values.password.value) &&
      passwordsMatch(
        values.password.value,
        values.password_confirmation.value
      ) &&
      values.terms.value &&
      values.privacy_policies.value
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      displayToasts({
        email: values.email.value,
        hotel_name: values.hotel_name.value,
        contact_phone: values.contact_phone.value,
        contact_name: values.contact_name.value,
        password: values.password.value,
        password_confirmation: values.password_confirmation.value,
        terms: values.terms.value,
        privacy_policies: values.privacy_policies.value,
      });
      return;
    }
    const loadingToastId = displayLoadingToast("Registering system...");

    const processed_hotel_name = values.hotel_name.value
      .trim()
      .toLowerCase()
      .replaceAll(" ", "-");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems`, {
      method: "POST",
      body: JSON.stringify({
        subdomain: processed_hotel_name,
        hotel_name: values.hotel_name.value.trim(),
        contact_name: values.contact_name.value,
        contact_email: values.email.value,
        contact_phone: values.contact_phone.value,
        password: values.password.value,
      }),
    });

    if (res.status === 409) {
      displayErrorToast("Database already exists!");
      return;
    } else if (res.status >= 400) {
      displayErrorToast("Something went wrong!");
      return;
    }
    closeLoadingToast(loadingToastId);
    displaySuccessToast("System registered successfully!");

    resetForm();
    router.push(`https://${processed_hotel_name}.putboot.dev/auth/sign-in`);
  };

  const resetForm = () => {
    setValues({
      hotel_name: defaultObject,
      contact_name: defaultObject,
      email: defaultObject,
      contact_phone: defaultObject,
      password: defaultObject,
      password_confirmation: defaultObject,
      terms: { value: false, error: "" },
      privacy_policies: { value: false, error: "" },
    });
  };

  const setErrorMessage = (
    e: FocusEvent<HTMLInputElement>,
    name: string,
    error: string
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: {
        value: e.target.value,
        error: error,
      },
    }));
  };

  return (
    <div className="flex justify-center p-10">
      <div className="w-full md:w-3/4 lg:w-2/3 shadow-2xl border border-gray-400 rounded-lg p-10">
        <div>
          <h1 className="text-5xl text-center">LOGO</h1>
          <h1 className="text-center text-2xl my-3 font-bold">
            {dict.registerSystem.title1}
          </h1>
          <h2 className="text-center text-lg font-semibold">
            {dict.registerSystem.title2}
          </h2>
        </div>
        <form className="p-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            label={dict.registerSystem.hotelName}
            errorMessage={values.hotel_name.error}
            subLabel={dict.registerSystem.hotelNameSubLabel}
            value={values.hotel_name.value}
            onChange={(e) => handleInputChange(e, "hotel_name")}
            onBlur={(e) =>
              setErrorMessage(
                e,
                "hotel_name",
                validateRequiredField(e.target.value, dict.auth.validationTexts)
              )
            }
          />
          <Input
            type="text"
            label={dict.registerSystem.personName}
            errorMessage={values.contact_name.error}
            value={values.contact_name.value}
            onChange={(e) => handleInputChange(e, "contact_name")}
            onBlur={(e) =>
              setErrorMessage(
                e,
                "contact_name",
                validateRequiredField(e.target.value, dict.auth.validationTexts)
              )
            }
          />
          <div className="lg:flex lg:space-x-10">
            <Input
              type="email"
              label={dict.registerSystem.email}
              errorMessage={values.email.error}
              value={values.email.value}
              onChange={(e) => handleInputChange(e, "email")}
              onBlur={(e) =>
                setErrorMessage(
                  e,
                  "email",
                  validateEmail(e.target.value, dict.auth.validationTexts)
                )
              }
            />
            <Input
              type="text"
              label={dict.registerSystem.phoneNumber}
              errorMessage={values.contact_phone.error}
              value={values.contact_phone.value}
              onChange={(e) => handleInputChange(e, "contact_phone")}
              onBlur={(e) =>
                setErrorMessage(
                  e,
                  "contact_phone",
                  validateRequiredField(
                    e.target.value,
                    dict.auth.validationTexts
                  )
                )
              }
            />
          </div>
          <div className="lg:flex lg:space-x-10">
            <Input
              type="password"
              label={dict.registerSystem.password}
              errorMessage={values.password.error}
              value={values.password.value}
              onChange={(e) => handleInputChange(e, "password")}
              onBlur={(e) =>
                setErrorMessage(
                  e,
                  "password",
                  validatePassword(e.target.value, dict.auth.validationTexts)
                )
              }
            />
            <Input
              type="password"
              label={dict.registerSystem.passwordConfirmation}
              errorMessage={values.password_confirmation.error}
              value={values.password_confirmation.value}
              onChange={(e) => handleInputChange(e, "password_confirmation")}
              onBlur={(e) =>
                setErrorMessage(
                  e,
                  "password_confirmation",
                  validateSecondPassword(
                    e.target.value,
                    values.password.value,
                    dict.auth.validationTexts
                  )
                )
              }
            />
          </div>
          <div className="text-sm flex flex-col justify-center text-[#0099ff] font-semibold">
            <div className="">
              <input
                type="checkbox"
                className="m-5 focus:ring-0 focus:ring-offset-0 rounded-md"
                checked={values.terms.value}
                onChange={() =>
                  setValues((prevValues) => ({
                    ...prevValues,
                    terms: {
                      ...prevValues.terms,
                      value: !prevValues.terms.value,
                    },
                  }))
                }
              />
              <span>
                {dict.registerSystem.termsAndConditions1}
                <Link href="#" className="underline font-bold">
                  {dict.registerSystem.termsAndConditionsLink}
                </Link>
                {dict.registerSystem.termsAndConditions2}
              </span>
              <div className="flex">
                <input
                  type="checkbox"
                  className="m-5 focus:ring-0 focus:ring-offset-0 rounded-md"
                  checked={values.privacy_policies.value}
                  onChange={() =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      privacy_policies: {
                        ...prevValues.privacy_policies,
                        value: !prevValues.privacy_policies.value,
                      },
                    }))
                  }
                />
                <div>
                  <p>
                    {dict.registerSystem.privacyPolicies1}
                    <Link href="#" className="underline font-bold">
                      {dict.registerSystem.privacyPoliciesLink}
                    </Link>
                    {dict.registerSystem.privacyPolicies2}
                  </p>
                  <p className="text-black">
                    {dict.registerSystem.privacyPolicies3}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="text-white h-10 w-40 bg-[#0099ff] mt-4 rounded-md">
              {dict.registerSystem.submitButtonText}
            </button>
          </div>
        </form>
      </div>
      {/* <ErrorDialog dialogRef={errorDialogRef} /> */}
      <ToastContainer
        className="flex flex-col items-end"
        toastClassName="w-56 h-fit"
      />
    </div>
  );
}

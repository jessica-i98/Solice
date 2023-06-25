import * as yup from "yup";
import { FieldError } from "../types";
export const phoneRegex = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/;
export const strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);
const usernameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_.]{1,30}$/;
const firstNameRegex = /^[\u0600-\u06FFa-zA-Z\s]{3,}$/;

export const fieldInvalidMsg = (fieldName: string) =>
  `${fieldName} معتبر نمی باشد.`;
export const fieldRequiredMsg = (fieldName: string) =>
  `وارد کردن ${fieldName} اجباری می باشد.`;
export const passwordPatternError =
  "رمز عبور باید حداقل 8 کاراکتر باشد و شامل حروف بزرگ و کوچک انگلیسی، اعداد و حروف ویژه (!@#$%^&*) باشد.";

export const mobValidate = yup
  .string()
  .matches(phoneRegex, fieldInvalidMsg("شماره موبایل"));

export const fieldMinMsg = (fieldName: string, min: number) =>
  `طول ${fieldName} باید حداقل ${min} کاراکتر باشد`;
export const fieldMaxMsg = (fieldName: string, max: number) =>
  `طول ${fieldName} باید حداکثر ${max} کاراکتر باشد`;
export const mobileValidator = yup.object().shape({
  mobile: mobValidate,
});
export const checkVerificationCodeValidator = yup.object().shape({
  mobile: mobValidate,
  code: yup
    .string()
    .typeError("کد وارد شده نامعتبر می باشد.")
    .min(4, fieldMinMsg("کد وارد شده", 4))
    .max(4, fieldMaxMsg("کد وارد شده", 4))
    .required(fieldRequiredMsg("کد وارد شده")),
});

export const formatYupError = (err: yup.ValidationError): FieldError[] => {
  const errors: FieldError[] = [];

  err?.inner?.forEach((e: any) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  return errors;
};

export const setupUserInfoInputSchema = yup.object().shape(
  {
    fName: yup
      .string()
      .optional()
      .nullable()
      .notRequired()
      .when("fName", {
        is: (value: any) => value?.length,
        then: (rule) =>
          rule
            .matches(firstNameRegex, fieldInvalidMsg("نام"))
            .max(20, fieldMaxMsg("نام", 20)),
      }),
    lName: yup
      .string()
      .optional()
      .nullable()
      .notRequired()
      .when("lName", {
        is: (value: any) => value?.length,
        then: (rule) =>
          rule
            .matches(firstNameRegex, fieldInvalidMsg("نام خانوادگی"))
            .max(20, fieldMaxMsg("نام خانوادگی", 20)),
      }),
    username: yup
      .string()
      .optional()
      .nullable()
      .notRequired()
      .when("username", {
        is: (value: any) => value?.length,
        then: (rule) =>
          rule
            .matches(usernameRegex, fieldInvalidMsg("نام کاربری"))
            .max(20, fieldMaxMsg("نام کاربری", 20)),
      }),
    email: yup
      .string()
      .required(fieldRequiredMsg("آدرس ایمیل"))
      .email(fieldInvalidMsg("آدرس ایمیل")),
    promoCode: yup.string().nullable(),
    birthday: yup.date().typeError(fieldInvalidMsg("تاریخ تولد")).nullable(),
    gender: yup
      .string()
      .nullable()
      .notRequired()
      .oneOf(["male", "female"], fieldInvalidMsg("جنسیت")),

    password: yup
      .string()
      .required(fieldRequiredMsg("رمز عبور"))
      .matches(strongRegex, passwordPatternError),
    confPassword: yup
      .string()
      .required(fieldRequiredMsg("تکرار عبور"))
      .oneOf(
        [yup.ref("password")],
        "تکرار رمز عبور باید با رمز عبور مطابقت داشته باشد."
      ),
    // password: yup
    //   .string()
    //   .optional()
    //   .nullable()
    //   .notRequired()
    //   .when("password", {
    //     is: (value: any) => value?.length,
    //     then: (rule) => rule.matches(strongRegex, passwordPatternError),
    //   }),
    // confPassword: yup
    //   .string()
    //   .optional()
    //   .nullable()
    //   .notRequired()
    //   .when("password", {
    //     is: (value: any) => value?.length,
    //     then: (rule) =>
    //       rule
    //         .required(fieldRequiredMsg("تکرار رمز عبور"))
    //         .oneOf(
    //           [yup.ref("password")],
    //           "تکرار رمز عبور باید با رمز عبور مطابقت داشته باشد."
    //         ),
    //   }),
  },
  [
    // Add Cyclic deps here because when require itself
    ["fName", "fName"],
    ["lName", "lName"],
    ["username", "username"],
    // ["password", "password"],
  ]
);
import * as yup from "yup";

export const followUpFormValidation = yup.object().shape({
  followUpDate: yup.string().required("Date field is required"),
});

import * as yup from "yup";

export const updateEnquiryStatusValidation = yup.object().shape({
  status: yup.string().required("Status field is required"),
});

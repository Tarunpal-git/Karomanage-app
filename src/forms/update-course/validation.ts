import * as yup from "yup";

export const updateCourseFormValidation = yup.object().shape({
  courseId: yup.string(),
  courseName: yup.string().required("Course name is required"),
  courseDescription: yup.string(),
  courseFee: yup
    .string()
    .required("Course fee is required")
    .test("is-number", "Course fee must be a number", (value) => {
      if (!value) return false;
      return !isNaN(Number(value)) && Number(value) > 0;
    }),
  courseFeeDescription: yup.string(),
  courseDurationYear: yup.string(),
  courseDurationMonth: yup.string(),
  maxPaymentInstallment: yup
    .string()
    .required("Max installment is required")
    .test("is-number", "Max installment must be a number", (value) => {
      if (!value) return false;
      return !isNaN(Number(value)) && Number(value) > 0;
    }),
}); 
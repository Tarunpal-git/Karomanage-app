import * as yup from "yup";

export const createBatchFormValidation = yup.object().shape({
  batchName: yup.string()
    .required("Batch name is required")
    .max(250, "Batch name cannot exceed 250 characters"),
  batchDescription: yup.string()
    .max(500, "Batch description cannot exceed 500 characters"),
  courseId: yup.string().required("Course is required"),
  batchStartDate: yup.string().required("Batch start date is required"),
  batchEndDate: yup.string().required("Batch end date is required"),
  setBatchTime: yup.string().required("Please select if you want to set batch time"),
  batchClassStartTime: yup.string().when("setBatchTime", {
    is: "Yes",
    then: (schema) => schema.required("Start time is required"),
    otherwise: (schema) => schema.optional(),
  }),
  batchClassEndTime: yup.string().when("setBatchTime", {
    is: "Yes",
    then: (schema) => schema.required("End time is required"),
    otherwise: (schema) => schema.optional(),
  }),
}); 
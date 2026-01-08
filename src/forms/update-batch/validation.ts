import * as yup from "yup";

export const updateBatchFormValidation = yup.object().shape({
  batchId: yup.string().required("Batch ID is required"),
  batchName: yup.string()
    .required("Batch name is required")
    .max(250, "Batch name cannot exceed 250 characters"),
  batchDescription: yup.string()
    .max(500, "Batch description cannot exceed 500 characters")
    .optional(),
  courseId: yup.string().optional(),
  batchStartDate: yup.string().required("Batch start date is required"),
  batchEndDate: yup.string().required("Batch end date is required"),
  setBatchTime: yup.string().required("Please select if you want to set batch time"),
  batchClassStartTime: yup.string().when("setBatchTime", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("Start time is required"),
    otherwise: (schema) => schema.optional(),
  }),
  batchClassEndTime: yup.string().when("setBatchTime", {
    is: (val: string) => val === "Yes",
    then: (schema) => schema.required("End time is required"),
    otherwise: (schema) => schema.optional(),
  }),
  batchStatus: yup.string().required("Status is required"),
}); 
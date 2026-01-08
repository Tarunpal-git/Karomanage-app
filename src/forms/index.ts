import { createExpenseValidation } from "./create-expense/validation";
import { createExpenseIniValues } from "./create-expense/values";
import { expenseCategoryValidation } from "./expenses-category/validation";
import { expenseCategoryIniValues } from "./expenses-category/values";
import { followUpFormValidation } from "./follow-up/validation";
import { followUpIniValues } from "./follow-up/values";
import { formTemplateFormValidation } from "./form-template/validation";
import { formTemplateValues } from "./form-template/values";
import { generateEnquiryFormValidation } from "./generate-enquiry/validation";
import { generateEnquiryFormIniValues } from "./generate-enquiry/values";
import { updateEnquiryStatusValidation } from "./update-enquiry-status/validation";
import { updateEnquiryStatusIniValues } from "./update-enquiry-status/values";
import { createBatchFormIniValues } from "./create-batch/values";
import { createBatchFormValidation } from "./create-batch/validation";
import { updateBatchFormIniValues } from "./update-batch/values";
import { updateBatchFormValidation } from "./update-batch/validation";
import { createCourseFormIniValues } from "./create-course/values";
import { createCourseFormValidation } from "./create-course/validation";
import { updateCourseFormValidation } from "./update-course/validation";

export const forms = {
  generateEnquiry: {
    values: generateEnquiryFormIniValues,
    validation: generateEnquiryFormValidation,
  },
  followUp: {
    values: followUpIniValues,
    validation: followUpFormValidation,
  },
  updateEnquiryStatus: {
    values: updateEnquiryStatusIniValues,
    validation: updateEnquiryStatusValidation,
  },
  formTemplate: {
    values: formTemplateValues,
    validation: formTemplateFormValidation,
  },
  expenseCategory: {
    values: expenseCategoryIniValues,
    validation: expenseCategoryValidation,
  },
  createExpense: {
    values: createExpenseIniValues,
    validation: createExpenseValidation,
  },
  createBatch: {
    values: createBatchFormIniValues,
    validation: createBatchFormValidation,
  },
  updateBatch: {
    values: updateBatchFormIniValues,
    validation: updateBatchFormValidation,
  },
  createCourse: {
    values: createCourseFormIniValues,
    validation: createCourseFormValidation,
  },
  updateCourse: {
    validation: updateCourseFormValidation,
  },
};

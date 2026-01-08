import * as yup from "yup";

export const expenseCategoryValidation = yup.object().shape({
  categoryName: yup.string().required("Category name is required"),
});

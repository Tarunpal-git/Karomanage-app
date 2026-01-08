import * as yup from "yup";
import { toCamelCase } from "./toCamelCase";

export const generateDynamicValidation = (formFields: TFormField[]) => {
  // Start with an empty Yup schema
  let schema = yup.object().shape({});

  // Loop through each form field and add validation rules based on type and isRequired flag
  formFields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case "email":
        fieldSchema = field.isRequired
          ? yup
              .string()
              .email("Enter a valid email")
              .required(field.message + ` is required`)
          : yup.string().email("Enter a valid email");
        break;
      case "number":
        fieldSchema = field.isRequired
          ? yup
              .number()
              .required(field.message + ` is required`)
              .typeError("Enter a digit")
          : yup.number().typeError("Enter a digit");
        break;
      case "dropDown":
        fieldSchema = field.isRequired
          ? yup.string().required(field.message + ` is required`)
          : yup.string();
        break;
      case "mobileNumber":
        fieldSchema = field.isRequired
          ? yup
              .string()
              .matches(/^\d{10}$/, "enter a valid mobile number")
              .required(field.message + ` is required`)
          : yup.string().matches(/^\d{10}$/, field.message);
        break;
      case "textField":
        fieldSchema = field.isRequired
          ? yup.string().required(field.message + ` is required`)
          : yup.string();
        break;
      case "radio":
        fieldSchema = field.isRequired
          ? yup.string().required(field.message + ` is required`)
          : yup.string();
        break;
      default:
        // Handle any other field types or cases here if needed
        break;
    }

    // Add the field validation schema to the main schema
    if (fieldSchema) {
      schema = schema.shape({
        [toCamelCase(field.name)]: fieldSchema,
      });
    }
  });

  return schema;
};

import * as yup from "yup";

export const formTemplateFormValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  message: yup.string().required("Description is required"),
  type: yup.string().required("Field type is required"),
  isRequired: yup.boolean(),
  options: yup.array().when("type", {
    is: (type: string) => type === "dropDown" || type === "radio",
    then: (schema) =>
      schema
        .of(
          yup.object().shape({
            name: yup.string().required("Option is required"),
          })
        )
        .min(2, "At least two options are required")
        .required("Options are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

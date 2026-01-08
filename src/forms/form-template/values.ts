interface IFormTemplateValues {
  formFields: TFormField[];
}

export const formTemplateValues: IFormTemplateValues = {
  formFields: [
    {
      name: "Name",
      isRequired: true,
      message: "Name ",
      type: "textField",
      options: [],
    },
    {
      name: "Email",
      isRequired: true,
      message: "Email",
      type: "email",
      options: [],
    },
    {
      name: "Mobile number",
      isRequired: true,
      message: "Mobile number",
      type: "mobileNumber",
      options: [],
    },
  ],
};

export const createFormFieldValues = {
  name: "",
  isRequired: false,
  message: "",
  type: "TextField",
  options: [{ name: "" }, { name: "" }],
};

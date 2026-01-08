type TFormFieldOption = {
  name: string;
};

type TFormField = {
  name: string;
  isRequired: boolean;
  message: string;
  type:
    | "email"
    | "number"
    | "dropDown"
    | "mobileNumber"
    | "textField"
    | "radio"
    | "date";

  options: TFormFieldOption[];
};

type TFormTemplate = {
  customerId: string;
  organizationId: string;
  formTemplateId: string;
  formTitle: string;
  formDescription: string;
  formFields: TFormField[];
  formStatus: string;
  dateCreated: number;
  lastUpdatedDate: number;
};

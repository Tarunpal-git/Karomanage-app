type TFormBulkData = TUploadFormTemplate & {
  formData: TBulkDataEnquiry[];
  flag: boolean;
};

type TBulkDataEnquiry = {
  data: any;
  customerId: string;
  organizationId: string;
  formTemplateId: string;
  formId: string;
  metaFields: string;
  formStatus: string;
  visited: boolean;
  dateCreated: number;
  lastUpdatedDate: number;
  formData: TExtendedFormType;
};

type TRequiredFields = {
  followUp: TFollowUp[];
  leadManager: TSelectedManager;
  // callLogs: TCallHistory[];
};

type TExtendedFormType = TFormData  & {
  [key: string]: any;
};

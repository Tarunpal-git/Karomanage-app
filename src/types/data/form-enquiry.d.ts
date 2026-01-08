type TFollowUp = {
  createDate: string;
  followUpDate: string;
  description: string;
  message: string;
  flag: string;
};

type TFormData = {
  email: string;
  mobileNumber: string;
  name: string;
  followUp: TFollowUp[];
  leadManager: TSelectedManager;
  announcements: TAnnouncementData[];
  // callLogs: TCallHistory[];
};

type TFormEnquiry = {
  customerId: string;
  organizationId: string;
  formTemplateId: string;
  formId: string;
  formData: TFormData;
  formStatus: string;
  dateCreated: number;
  lastUpdatedDate: number;
  visited: boolean;
  
};

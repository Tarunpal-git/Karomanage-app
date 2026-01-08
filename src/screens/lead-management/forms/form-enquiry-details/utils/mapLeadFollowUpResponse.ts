type TLeadFollowUpResponse = {
  msg?: string;
  data: Array<{
    createDate: string;
    followUpDate: string;
    description: string;
    message: string;
    followUpId: string;
    lastModifiedDate: number;
    flag?: string;
  }>;
  statusCode?: number;
  [key: string]: any;
};

export const mapLeadFollowUpToFormEnquiry = (
  response: TLeadFollowUpResponse,
  formTemplateId?: string
): TFormEnquiry | undefined => {
  if (!response?.data || !Array.isArray(response.data) || response.data.length === 0) {
    return undefined;
  }

  // Map followUp array directly from response.data
  const mappedFollowUp = response.data.map((followUp) => ({
    createDate: followUp.createDate || "",
    followUpDate: followUp.followUpDate || "",
    description: followUp.description || "",
    message: followUp.message || "",
    flag: followUp.flag || "", 
    followUpId: followUp.followUpId || "",
  }));

  return {
    customerId: "",
    organizationId: "",
    formTemplateId: formTemplateId || "",
    formId: "",
    formStatus: "active",
    formData: {
      name: "",
      email: "",
      mobileNumber: "",
      followUp: mappedFollowUp,
      leadManager: {} as any,
      announcements: [],
    },
    dateCreated: Date.now(),
    lastUpdatedDate: Date.now(),
    visited: false,
  };
};


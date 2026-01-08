type TAllLeadsByFilterResponse = {
  leadCount: number;
  totalAssignedLeads: number;
  totalUnAssigned: number;
  data: Array<{
    customerId: string;
    organizationId: string;
    leadId: string;
    leadSourceType: string;
    leadName: string;
    leadMobileNumber: string;
    leadEmail: string;
    status: string;
    assigneLeadManagers: Array<{
      managerId?: string;
      managerName?: string;
      [key: string]: any;
    }>;
    formTemplateId: string;
    formData: Record<string, any>;
    dateCreated: number;
    lastModifiedDate: number;
    visited: boolean;
    [key: string]: any;
  }>;
};

export const mapAllLeadsByFilterToFormEnquiry = (
  response: TAllLeadsByFilterResponse,
  formTemplateId: string
): TFormEnquiry[] => {
  if (!response?.data || !Array.isArray(response.data)) {
    return [];
  }
console.log(response,"responseresponse")
  // ✅ FILTER: Only process items that match formTemplateId
  const filteredData = response.data.filter((item) => {
    return item.formTemplateId === formTemplateId;
  });

  return filteredData.map((item) => {
    // Get manager name from assigneLeadManagers array
    const managerName =
      item.assigneLeadManagers && item.assigneLeadManagers.length > 0
        ? item.assigneLeadManagers[0]?.managerName || ""
        : "";

    return {
      customerId: item.customerId || "",
      organizationId: item.organizationId || "",
      formTemplateId: item.formTemplateId || formTemplateId || "",
      formId: item.leadId || "",
      formStatus: item.status || "active",
      formData: {
        // 🔥 INCLUDE ALL DYNAMIC FIELDS FROM BACKEND
        ...(item.formData || {}),
        name: item.leadName || "",
        email: item.leadEmail || "",
        mobileNumber: item.leadMobileNumber || "",
        followUp: item.formData?.followUp || [],
        leadManager: managerName
          ? ({
              managerName: managerName,
              managerId: item.assigneLeadManagers[0]?.managerId || "",
            } as any)
          : ({} as any),
        announcements: item.formData?.announcements || [],
      },
      dateCreated: item.dateCreated || Date.now(),
      lastUpdatedDate: item.lastModifiedDate || Date.now(),
      visited: item.visited ?? false,
    };
  });
};


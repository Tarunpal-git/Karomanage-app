import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  employee: {
    employeId: string;
    month: string;
    salaryId: string;
    year: string;
  };
};

const downloadReport = async (data: TData) => {
  const organization = store.getState().auth.selectedOrganization;

  const response = await request({
    url: apiUrls.reports.DOWNLOAD_COMMON_REPORT,
    method: "POST",
    data: {
      employee: data.employee,
      action: "employee",
      customerId: organization?.customerId ?? "",
      organizationId: organization?.organizationId ?? "",
    },
  });
  return response;
};

export const useDownloadSalarySlipMutation = () => {
  return useMutation({ mutationFn: downloadReport });
};

import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";
import moment from "moment";

const updateBatch = async (data: any) => {
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;
  
  const payload = {
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.roleName || "",
      roleId: user?.roleId || "",
      userEmployeeId: user?.employeeId || "",
    },
    customerId: selectedOrganization?.customerId,
    organizationId: selectedOrganization?.organizationId,
    batchId: data.batchId,
    batch: {
      batchName: data.batchName,
      batchStartDate: data.batchStartDate ? moment(data.batchStartDate, "YYYY-MM-DD").format("DD/MM/YYYY") : "",
      batchEndDate: data.batchEndDate ? moment(data.batchEndDate, "YYYY-MM-DD").format("DD/MM/YYYY") : "",
      batchClassStartTime: data.setBatchTime === "Yes" ? data.batchClassStartTime : "",
      batchClassEndTime: data.setBatchTime === "Yes" ? data.batchClassEndTime : "",
      batchStatus: data.batchStatus || "active",
    },
    subjects: data.subjects || [],
  };
  
  console.log('=== UPDATE BATCH PAYLOAD ===');
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('=== END UPDATE BATCH PAYLOAD ===');
  
  return request({
    url: apiUrls.batch.UPDATE_BATCH,
    method: "POST",
    data: payload,
  });
};

export const useUpdateBatchMutation = () => useMutation({ mutationFn: updateBatch });


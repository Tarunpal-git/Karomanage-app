import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

const updateBatchStatus = async (data: { batchId: string; batchStatus: string }) => {
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
    batchStatus: data.batchStatus,
  };
  
  console.log("=== UPDATE BATCH STATUS API CALL ===");
  console.log("Payload:", JSON.stringify(payload, null, 2));
  
  const response = await request({
    url: apiUrls.batch.DELETE_BATCH,
    method: "POST",
    data: payload,
  });
  
  console.log("=== UPDATE BATCH STATUS API RESPONSE ===");
  console.log("Response:", JSON.stringify(response, null, 2));
  console.log("=== END UPDATE BATCH STATUS API RESPONSE ===");
  
  return response;
};

export const useUpdateBatchStatusMutation = () => useMutation({ mutationFn: updateBatchStatus });





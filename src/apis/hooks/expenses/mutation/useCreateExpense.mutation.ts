import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";
import { forms } from "../../../../forms";
import { checkValuesBeforeApiCall } from "../../../../utils/debugOrganization";

const update = async (data: typeof forms.createExpense.values) => {
  // Debug check before API call
  const debugInfo = checkValuesBeforeApiCall("CREATE_EXPENSE");
  
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;

  console.log("💰 === CREATE EXPENSE DEBUG ===");
  console.log("User:", user);
  console.log("Selected Organization:", selectedOrganization);
  console.log("Form Data:", data);

  const updateData = {
    ...data,
    user: JSON.stringify({
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    }),
    customerId: selectedOrganization?.customerId,
    organizationId: selectedOrganization?.organizationId,
  };

  console.log("Final updateData:", updateData);
  console.log("💰 === END CREATE EXPENSE DEBUG ===");

  const response = await request({
    url: apiUrls.expenses.CREATE_EXPENSE,
    method: "POST",
    data: updateData,
  });

  return response;
};

export const useCreateExpenseMutation = () => {
  return useMutation({
    mutationFn: update,
  });
};

import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";
import { forms } from "../../../../forms";

const update = async (data: typeof forms.expenseCategory.values) => {
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;

  const updateData = {
    ...data,
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    },
    customerId: selectedOrganization?.customerId,
    organizationId: selectedOrganization?.organizationId,
  };

  const response = await request({
    url: apiUrls.expenses.CREATE_EXPENSE_CATEGORY,
    method: "POST",
    data: updateData,
  });
  return response;
};

export const useCreateExpenseCategoryMutation = () => {
  return useMutation({
    mutationFn: update,
  });
};

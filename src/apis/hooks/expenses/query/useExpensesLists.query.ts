import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { ORGANIZATION_PREFIX } from "../../../../constants";

const get = async () => {
  const response = await request({
    url: apiUrls.expenses.FETCH_EXPENSES_LIST,
    method: "GET",
  });

  if (response.statusCode === 200) {
    response.data = response.data.filter(
      (expense: TExpenseData) => expense.expenseStatus !== "delete"
    );
  }

  return response;
};

export const useExpensesListsQuery = () => {
  return useQuery({
    queryKey: [ORGANIZATION_PREFIX, apiUrls.expenses.FETCH_EXPENSES_LIST],
    queryFn: get,
  });
};

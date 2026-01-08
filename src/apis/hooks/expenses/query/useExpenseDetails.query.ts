import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (expenseId: string) => {
  const response = await request({
    url: apiUrls.expenses.FETCH_EXPENSE_DETAILS,
    method: "GET",
    params: {
      expenseId: expenseId,
    },
  });
  return response;
};

export const useExpenseDetailsQuery = (expenseId: string) => {
  return useQuery({
    queryKey: [apiUrls.expenses.FETCH_EXPENSE_DETAILS, expenseId],
    queryFn: () => get(expenseId),
  });
};

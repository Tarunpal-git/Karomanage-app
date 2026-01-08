import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

const createEmployee = async (data: any) => {
  const response = await request({
    url: apiUrls.employees.CREATE_EMPLOYEE,
    method: "POST",
    data: data,
  });
  return response;
};

export const useCreateEmployeeMutation = () => {
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (data) => {
      console.log('✅ Employee created successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Error creating employee:', error);
    },
  });
};
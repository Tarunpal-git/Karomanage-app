import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { COLLEGE_URLS } from "../../../urls/college.urls";

interface CreateCollegeData {
  state: string;
  city: string;
  collegeName: string;
  departments: Array<{
    departmentName: string;
    courses: Array<{
      coursesName: string;
    }>;
  }>;
}

const createCollege = async (data: CreateCollegeData) => {
  const response = await request({
    url: COLLEGE_URLS.CREATE_COLLEGE,
    method: "POST",
    data,
  });
  return response;
};

export const useCreateCollegeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      // Invalidate and refetch college list
      queryClient.invalidateQueries({ queryKey: [COLLEGE_URLS.GET_COLLEGE_LIST] });
    },
  });
}; 
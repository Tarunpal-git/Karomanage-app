import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const createTeacher = async (data: any) => {
  const response = await request({
    url: apiUrls.teacher.CREATE_TEACHER,
    method: "POST",
    data: data,
  });
  return response;
};

export const useCreateTeacherMutation = () => {
  return useMutation({
    mutationFn: createTeacher,
    onSuccess: (data) => {
      console.log('✅ Teacher created successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Error creating teacher:', error);
    },
  });
};


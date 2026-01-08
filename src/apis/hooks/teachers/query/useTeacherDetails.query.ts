import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

const get = async (teacherId: string) => {
  const organization = store.getState().auth.selectedOrganization;

  const response = await request({
    url: apiUrls.teacher.FETCH_TEACHER_DETAILS,
    method: "POST",
    data: {
      teacherId,
      customerId: organization?.customerId ?? "",
      organizationId: organization?.organizationId ?? "",
    },
  });
  return response;
};

export const useTeacherDetailsQuery = (teacherId: string) => {
  const organization = store.getState().auth.selectedOrganization;
  return useQuery({
    queryKey: [
      apiUrls.teacher.FETCH_TEACHER_DETAILS,
      teacherId,
      organization?.customerId,
      organization?.organizationId,
    ],
    queryFn: () => get(teacherId),
  });
};

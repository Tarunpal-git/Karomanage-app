import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

interface IData {
  courseId: string;
}

const get = async (data: IData) => {
  const organization = store.getState().auth.selectedOrganization;

  const response = await request({
    url: apiUrls.course.FETCH_COURSE_DETAILS,
    method: "POST",
    data: {
      courseId: data.courseId,
      customerId: organization?.customerId,
      organizationId: organization?.organizationId,
    },
  });
  return response;
};

export const useCourseDetailsQuery = (data: IData) => {
  return useQuery({
    queryKey: [apiUrls.course.FETCH_COURSE_DETAILS, data],
    queryFn: () => get(data),
  });
};

import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.course.FETCH_COURSES_LIST,
    method: "GET",
    // Unified endpoint: /organizationDetails*/batchAndCourseV2?type=course
    params: {
      type: "course",
    },
  });
  return response;
};

export const useCourseListsQuery = () => {
  return useQuery({
    queryKey: [apiUrls.course.FETCH_COURSES_LIST],
    queryFn: get,
  });
};

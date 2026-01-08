import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.userManagement.FETCH_ALL_USERS_LIST,
    method: "GET",
  });
  return response;
};

export const useFetchAllUsersQuery = () => {
  return useQuery({
    queryKey: [apiUrls.userManagement.FETCH_ALL_USERS_LIST],
    queryFn: get,
  });
};

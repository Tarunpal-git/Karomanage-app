import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

export const useGetClassroomListQuery = (enabled: boolean = true) => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  return useQuery({
    queryKey: [
      "classroomList",
      selectedOrganization?.customerId,
      selectedOrganization?.organizationId,
    ],
    queryFn: async () => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      console.log("🎯 GET CLASSROOM LIST API CALL");

      const response = await request({
        method: "GET",
        url: apiUrls.classroom.GET_CLASSROOM_LIST,
        params: {
          customerId: selectedOrganization.customerId,
          organizationId: selectedOrganization.organizationId,
        },
      });

      console.log("🎯 CLASSROOM LIST RESPONSE:", response);
      return response;
    },
    enabled: enabled && !!selectedOrganization,
  });
};



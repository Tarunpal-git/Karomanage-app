import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

type DeleteTimeTablePayload = Record<string, any>;

export const useDeleteTimeTableMutation = () => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationFn: async (data: DeleteTimeTablePayload) => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      const payload = {
        ...data,
        customerId: data?.customerId ?? selectedOrganization.customerId,
        organizationId: data?.organizationId ?? selectedOrganization.organizationId,
      };

      console.log("🗓️ === DELETE TIMETABLE API CALL ===");
      console.log("API URL:", apiUrls.timetable.DELETE_TIME_TABLE);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await request({
        method: "POST",
        url: apiUrls.timetable.DELETE_TIME_TABLE,
        data: payload,
      });

      console.log("🗓️ DELETE TIMETABLE RESPONSE:", JSON.stringify(response, null, 2));
      console.log("🗓️ === END DELETE TIMETABLE API CALL ===");

      return response;
    },
  });
};




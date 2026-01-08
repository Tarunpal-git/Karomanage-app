import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

type UpdateTimeTablePayload = Record<string, any>;

export const useUpdateTimeTableMutation = () => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationFn: async (data: UpdateTimeTablePayload) => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      const payload = {
        ...data,
        customerId: data?.customerId ?? selectedOrganization.customerId,
        organizationId: data?.organizationId ?? selectedOrganization.organizationId,
      };

      console.log("🗓️ === UPDATE TIMETABLE API CALL ===");
      console.log("API URL:", apiUrls.timetable.UPDATE_TIME_TABLE);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      try {
        const response = await request({
          method: "POST",
          url: apiUrls.timetable.UPDATE_TIME_TABLE,
          data: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("🗓️ UPDATE TIMETABLE RESPONSE:", JSON.stringify(response, null, 2));
        console.log("🗓️ === END UPDATE TIMETABLE API CALL ===");

        // Check for error responses
        if (response?.status === 404 || response?.data?.statusCode === 404) {
          throw new Error(response?.data?.message || "Resource not found");
        }

        // Handle empty string response (like create API)
        if (typeof response === "string" && response === "") {
          console.log("⚠️ Backend returned empty string, but data might be updated (like web)");
          return {
            statusCode: 200,
            message: "Updated successfully",
            data: null,
          };
        }

        return response;
      } catch (error: any) {
        console.error("🗓️ UPDATE TIMETABLE ERROR:", error);
        // Re-throw to let React Query handle it
        throw error;
      }
    },
  });
};




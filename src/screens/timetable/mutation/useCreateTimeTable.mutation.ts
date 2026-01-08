import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

type CreateTimeTablePayload = Record<string, any>;

export const useCreateTimeTableMutation = () => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationFn: async (data: CreateTimeTablePayload) => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      const payload = {
        ...data,
        customerId: data?.customerId ?? selectedOrganization.customerId,
        organizationId: data?.organizationId ?? selectedOrganization.organizationId,
      };

      console.log("🗓️ === CREATE TIMETABLE API CALL ===");
      console.log("API URL:", apiUrls.timetable.CREATE_TIME_TABLE);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await request({
        method: "POST",
        url: apiUrls.timetable.CREATE_TIME_TABLE,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("🗓️ CREATE TIMETABLE RESPONSE:", JSON.stringify(response, null, 2));
      console.log("🗓️ === END CREATE TIMETABLE API CALL ===");
      console.log("🗓️ Response type:", typeof response);
      console.log("🗓️ Response is null:", response === null);
      console.log("🗓️ Response is undefined:", response === undefined);
      console.log("🗓️ Response is empty string:", response === "");
      console.log("🗓️ Response keys:", response ? Object.keys(response) : "N/A");
      console.log("🗓️ Response status:", response?.status);
      console.log("🗓️ Response statusCode:", response?.data?.statusCode);
      console.log("🗓️ Response data:", response?.data);

      // Check if response is an error object (from axios onError)
      if (!response) {
        console.error("❌ Response is null/undefined - API call failed");
        throw new Error("API call failed. Please check your network connection and try again.");
      }

      // Check for 404 or other error status codes
      if (response?.status === 404 || response?.data?.statusCode === 404) {
        console.error("❌ 404 Error from backend");
        const errorMessage = response?.data?.message || response?.message || "API endpoint not found (404). Please check the backend service.";
        throw new Error(errorMessage);
      }

      // Check for other error status codes (400, 500, etc.)
      if (response?.status && response.status >= 400) {
        console.error(`❌ ${response.status} Error from backend`);
        const errorMessage = response?.data?.message || response?.message || `API error (${response.status}). Please try again.`;
        throw new Error(errorMessage);
      }

      // If response is empty string (backend returns "" but saves data), return success object
      if (typeof response === "string" && response === "") {
        console.log("⚠️ Backend returned empty string, but data might be saved (like web)");
        return {
          statusCode: 200,
          message: "Created successfully",
          data: null,
        };
      }

      return response;
    },
  });
};




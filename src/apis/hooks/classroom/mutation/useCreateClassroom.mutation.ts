import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

interface CreateClassroomPayload {
  classRoomName: string;
  capacity: string | number;
  location: string;
}

export const useCreateClassroomMutation = () => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { authUser } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClassroomPayload) => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      const payload = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        location: data.location,
        capacity: data.capacity,
        classRoomName: data.classRoomName,
      };

      console.log("🏫 === CREATE CLASSROOM API CALL ===");
      console.log("API URL:", apiUrls.classroom.CREATE_CLASSROOM);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await request({
        method: "POST",
        url: apiUrls.classroom.CREATE_CLASSROOM,
        data: payload,
      });

      console.log("🏫 CREATE CLASSROOM RESPONSE:", JSON.stringify(response, null, 2));
      console.log("🏫 === END CREATE CLASSROOM API CALL ===");

      return response;
    },
    onSuccess: (_, __, context) => {
      if (!selectedOrganization) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: [
          "classroomList",
          selectedOrganization.customerId,
          selectedOrganization.organizationId,
        ],
      });
    },
  });
};


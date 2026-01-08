import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

interface DeleteClassroomPayload {
  classRoomId: string;
}

export const useDeleteClassroomMutation = () => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { authUser } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationFn: async (data: DeleteClassroomPayload) => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      const payload = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        classRoomId: data.classRoomId,
      };

      console.log("🗑️ === DELETE CLASSROOM API CALL ===");
      console.log("API URL:", apiUrls.classroom.DELETE_CLASSROOM);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await request({
        method: "POST",
        url: apiUrls.classroom.DELETE_CLASSROOM,
        data: payload,
      });

      console.log("🗑️ DELETE CLASSROOM RESPONSE:", JSON.stringify(response, null, 2));
      console.log("🗑️ === END DELETE CLASSROOM API CALL ===");

      return response;
    },
  });
};




import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

interface UpdateClassroomPayload {
  classRoomId: string;
  classRoomName: string;
  capacity: string | number;
  location: string;
}

export const useUpdateClassroomMutation = () => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { authUser } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationFn: async (data: UpdateClassroomPayload) => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      const payload = {
        customerId: selectedOrganization.customerId,
        organizationId: selectedOrganization.organizationId,
        classRoomId: data.classRoomId,
        location: data.location,
        capacity: data.capacity,
        classRoomName: data.classRoomName,
      };

      console.log("✏️ === UPDATE CLASSROOM API CALL ===");
      console.log("API URL:", apiUrls.classroom.UPDATE_CLASSROOM);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await request({
        method: "POST",
        url: apiUrls.classroom.UPDATE_CLASSROOM,
        data: payload,
      });

      console.log("✏️ UPDATE CLASSROOM RESPONSE:", JSON.stringify(response, null, 2));
      console.log("✏️ === END UPDATE CLASSROOM API CALL ===");

      return response;
    },
  });
};




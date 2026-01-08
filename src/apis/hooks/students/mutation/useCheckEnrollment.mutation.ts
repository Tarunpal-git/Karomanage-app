import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

interface CheckEnrollmentPayload {
  studentEnrollmentNumber: string;
}

interface CheckEnrollmentResponse {
  statuscode: number;
  message: string;
}

const checkEnrollment = async (payload: CheckEnrollmentPayload): Promise<CheckEnrollmentResponse> => {
  const selectedOrganization = store.getState().auth.selectedOrganization;
  
  if (!selectedOrganization) {
    throw new Error("No organization selected");
  }

  const requestPayload = {
    customerId: selectedOrganization.customerId,
    studentEnrollmentNumber: payload.studentEnrollmentNumber,
    organizationId: selectedOrganization.organizationId,
  };

  const response = await request({
    url: apiUrls.student.CHECK_ENROLLMENT,
    method: "POST",
    data: requestPayload,
  });

  return response;
};

export const useCheckEnrollmentMutation = () => {
  return useMutation({
    mutationFn: checkEnrollment,
    onError: (error) => {
      console.error("Enrollment check error:", error);
    },
  });
}; 
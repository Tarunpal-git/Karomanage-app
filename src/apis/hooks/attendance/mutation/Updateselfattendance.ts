import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";
import moment from "moment";

type TData = {
  batchId: string;
  attendanceDate: Date;
  attendanceId: string;
  students: {
    studentId: string;
    attendanceStatus: string;
  }[];
  employeeId: string;
};

const checkInAttendance = async (data: TData) => {
  try {
    // Log the organization details to ensure it's valid
    const organization = store.getState().auth.selectedOrganization;
    console.log("[checkInAttendance] Selected Organization:", organization);
    
    if (!organization || !organization.customerId || !organization.organizationId) {
      throw new Error("Invalid organization details.");
    }

    // Format attendanceId to 'YYYYMMDD' format
    const formattedAttendanceId = moment(data.attendanceId).format("YYYYMMDD");
    console.log("[checkInAttendance] Formatted attendanceId:", formattedAttendanceId);
    
    // Prepare the payload
    const payload = {
      batchId: data.batchId,
      customerId: organization.customerId,
      organizationId: organization.organizationId,
      attendanceId: formattedAttendanceId,
      employeeId: data.employeeId,
    };

    // Log the payload to see what's being sent in the request
    console.log("[checkInAttendance] Request Payload:", payload);

    // Send the request
    const response = await request({
      url: apiUrls.attendance.UPDATE_SELF_ATTENDANCE,
      method: "POST",
      data: payload,
    });

    // Log the response from the API
    console.log("[checkInAttendance] API Response:", response);

    return response;
  } catch (error) {
    // Log any errors encountered
    console.error("[checkInAttendance] Error:", error);
    throw error;
  }
};

export const useUpdateSelfAttendance = () => {
  return useMutation({ mutationFn: checkInAttendance });
};

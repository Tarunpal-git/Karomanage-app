import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TLectureAttendanceData = {
  lectureId: string;
  employeeId: string;
  attendanceDate: string; // ISO string
  status: string;
};

const markLectureAttendance = async (data: TLectureAttendanceData) => {
  try {
    const organization = store.getState().auth.selectedOrganization;

    if (!organization || !organization.customerId || !organization.organizationId) {
      throw new Error("Invalid organization details.");
    }

    const response = await request({
      url: apiUrls.attendance.MARK_LECTURE_ATTENDANCE, // Replace with your actual endpoint
      method: "POST",
      data: {
        lectureId: data.lectureId,
        employeeId: data.employeeId,
        attendanceDate: data.attendanceDate,
        status: data.status,
        customerId: organization.customerId,
        organizationId: organization.organizationId,
      },
    });

    return response;
  } catch (error) {
    console.error("Error in markLectureAttendance:", error);
    throw error;
  }
};

export const useMarkLectureAttendance = () => {
  return useMutation(markLectureAttendance);
};

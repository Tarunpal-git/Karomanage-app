import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

type TData = {
  customerID: string;
  organizationId: string;
  studentName: string;
  enquiryCourse: string;
  status: string;
  mobileNumber: string;
  email?: string;
  parentName?: string;
  parentContact?: string;
  college?: string;
  collegeDepartment?: string;
  semester?: string;
  collegeCourse?: string;
  courseDescription: string;
  followUp: [];
};

const generateEnquiry = async (data: TData) => {
  const response = await request({
    url: apiUrls.enquiry.GENERATE_ENQUIRY,
    method: "POST",
    data: data,
  });
  return response;
};

export const useGenerateEnquiryMutation = () => {
  return useMutation({ mutationFn: generateEnquiry });
};

import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IInstallments {
  overDueDate: string;
  courseId: string;
  overDueAmount: number;
  index: string;
}

export type TNotifyUpcomingFeeNotificationData = {
  accountId: string;
  courseName: string;
  customerId: string;
  installmentsArray: IInstallments[];
  organizationEmail: string;
  organizationId: string;
  organizationLogo: string;
  organizationName: string;
  organizationPhoneNumber: string;
  studentEmail: string;
  studentId: string;
  studentName: string;
};

const notifyFee = async (data: TNotifyUpcomingFeeNotificationData) => {
  const response = await request({
    url: apiUrls.emailServiceUrl.NOTIFY_UPCOMING_FEE_NOTIFICATION,
    method: "POST",
    data: data,
  });
  return response;
};

export const useNotifyUpcomingFeeMutation = () => {
  return useMutation({ mutationFn: notifyFee });
};

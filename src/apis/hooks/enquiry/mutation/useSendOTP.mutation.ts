import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { ENQUIRY_PREFIX } from "../../../../constants";
import { useAppSelector } from "../../../../app/hooks";

type TSendOtpPayload = {
  user: {
    userCustomerId: string;
    userCustomerName: string;
    userCustomerEmail: string;
    roleName: string;
    roleId: string;
    employeeId: string | null;
  };
  customerId: string;
  organizationId: string;
  walletId: string;
  studentMobileNumber: string;
  flag: "enquiry";
};

const sendOtp = async (payload: TSendOtpPayload) => {
  const response = await request({
    url: `${ENQUIRY_PREFIX}otpVerificationEnquiry`,
    method: "POST",
    data: payload,
  });
  return response;
};

export const useSendOTPMutation = () => {
  const { authUser, selectedOrganization } = useAppSelector(
    (state) => state.auth
  );
  const { organization } = useAppSelector((state) => state.organization);

  return useMutation({
    mutationFn: async (mobileNumber: string) => {
      const customerId =
        selectedOrganization?.customerId || authUser?.customerId || "";
      const organizationId =
        selectedOrganization?.organizationId || organization.organizationId;
      const walletId = organization.walletId;

      const payload: TSendOtpPayload = {
        user: {
          userCustomerId: authUser?.customerId || "",
          userCustomerName: authUser?.customerName || "",
          userCustomerEmail: authUser?.email || "",
          roleName: authUser?.roleName || "",
          roleId: authUser?.roleId || "",
          employeeId: (authUser as any)?.employeeId || null,
        },
        customerId,
        organizationId,
        walletId,
        studentMobileNumber: mobileNumber,
        flag: "enquiry",
      };

      return sendOtp(payload);
    },
  });
};



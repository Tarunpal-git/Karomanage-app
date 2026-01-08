import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

type TCaptchaPayload = {
  gRecaptchaResponse: string;
};

const verifyCaptcha = async (payload: TCaptchaPayload) => {
  const response = await request({
    url: apiUrls.enquiry.CAPTCHA_RESPONSE,
    method: "POST",
    data: payload,
  });
  return response;
};

export const useCaptchaResponseMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      verifyCaptcha({ gRecaptchaResponse: token }),
  });
};



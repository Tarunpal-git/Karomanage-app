import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
const signIn = async (data: { id_token: string }) => {
  const response = await request({
    url: apiUrls.auth.SIGN_IN,
    method: "POST",
    data: data,
  });
  return response;
};

export const useSignInMutation = () => {
  return useMutation({ mutationFn: signIn });
};

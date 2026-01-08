import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { notificationsUrl } from "../../../urls/notfications.url";

const get = async (flag: string) => {
  const response = await request({
    url: `${notificationsUrl.FETCH_NOTIFICATION_DETAILS}?flag=${flag}`,
    method: "GET",
  });
  return response;
};

export const useNotificationDetailsQuery = (flag: string) => {
  return useQuery({
    queryKey: [notificationsUrl.FETCH_NOTIFICATION_DETAILS, flag],
    queryFn: () => get(flag),
  });
};

// import { useQuery } from "@tanstack/react-query";
// import { request } from "../../../../services/axios.service";
// import { notificationsUrl } from "../../../urls/notfications.url";

// const get = async (flag: string) => {
//   try {
//     const response = await request({
//       url: `${notificationsUrl.FETCH_NOTIFICATION_DETAILS}?flag=${flag}`,
//       method: "GET",
//     });
//     console.log("API URL:", `${notificationsUrl.FETCH_NOTIFICATION_DETAILS}?flag=${flag}`);

//     if (response?.statusCode === 200 && response.data) {
//       return response;
//     }
//     throw new Error(`API returned invalid response: ${JSON.stringify(response)}`);
//   } catch (error) {
//     console.error("Error in fetching notification details:", error.message, error.stack);
//     throw error;
//   }
// };


// export const useNotificationDetailsQuery = (flag: string) => {
//   return useQuery({
//     queryKey: [notificationsUrl.FETCH_NOTIFICATION_DETAILS, flag],
//     queryFn: () => get(flag),
//     retry: 3, // Retry up to 3 times on failure
//     onError: (error: any) => {
//       console.error(`Error fetching ${flag} notifications:`, error);
//     },
//   });
// };


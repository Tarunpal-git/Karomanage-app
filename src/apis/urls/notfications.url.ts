import { NOTIFICATION_HUB_PREFIX } from "../../constants";

export const notificationsUrl = {
  FETCH_NOTIFICATION_DETAILS: process.env.REACT_APP_NOTIFICATION_API_URL ||
    // NOTIFICATION_HUB_PREFIX + "getNotificationDetails",
    `${NOTIFICATION_HUB_PREFIX}/getNotificationDetails`,
};

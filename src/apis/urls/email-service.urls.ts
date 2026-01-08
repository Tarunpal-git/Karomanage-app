import { MAIL_SERVICE_PREFIX } from "../../constants";

export const emailServiceUrl = {
  INVOKE_MAIL: MAIL_SERVICE_PREFIX + "manual/paths/invoke",
  NOTIFY_UPCOMING_FEE_NOTIFICATION:
    MAIL_SERVICE_PREFIX + "studentUpcomingFeeNotification",
};

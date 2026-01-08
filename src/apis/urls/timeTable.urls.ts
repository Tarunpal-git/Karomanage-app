import { TIME_TABLE_PREFIX } from  "../../constants";

export const timeTableUrls = {
  FETCH_TIME_TABLE: TIME_TABLE_PREFIX + "getTimeTable",
  CREATE_TIME_TABLE: TIME_TABLE_PREFIX + "createTimeTabel", // Backend expects "createTimeTabel" (typo in backend)
  UPDATE_TIME_TABLE: TIME_TABLE_PREFIX + "updateTimeTable",
  DELETE_TIME_TABLE: TIME_TABLE_PREFIX + "deleteTimeTable",
  REPEAT_TIME_TABLE_SLOT: TIME_TABLE_PREFIX + "repeatTimeTableSlot",
};

import { BATCH_PREFIX, ORGANIZATION_PREFIX } from "../../constants";

export const batchesUrls = {
  // List batches & courses now come from a unified endpoint: batchAndCourseV2
  // We keep the same URL key and control behaviour via the `type` query param
  FETCH_BATCHES_LIST: ORGANIZATION_PREFIX + "batchAndCourseV2",
  FETCH_BATCH_DETAILS: BATCH_PREFIX + "singleBatch",
  CREATE_BATCH: BATCH_PREFIX + "createBatch",
  UPDATE_BATCH: BATCH_PREFIX + "updateBatch",
  DELETE_BATCH: BATCH_PREFIX + "deleteBatch",
};

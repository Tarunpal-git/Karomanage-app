import { ORGANIZATION_PREFIX } from "../../constants";

export const coursesUrls = {
  // List courses & batches now come from a unified endpoint: batchAndCourseV2
  // We keep the same URL key and control behaviour via the `type` query param
  FETCH_COURSES_LIST: ORGANIZATION_PREFIX + "batchAndCourseV2",
  FETCH_COURSE_DETAILS: ORGANIZATION_PREFIX + "singleCourseDetails",
  UPDATE_COURSE: ORGANIZATION_PREFIX + "updateCourse",
};

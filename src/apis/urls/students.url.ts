import { STUDENT_PREFIX } from "../../constants";

const CUSTOMER_REGISTRATION_PREFIX = "customer-registration-prod/";

export const studentUrls = {
  // Updated to use new student filter API provided by backend
  FETCH_ALL_STUDENTS: STUDENT_PREFIX + "studentFilterListV2",
  FETCH_STUDENT_DETAILS: STUDENT_PREFIX + "getStudentDetails",
  CHECK_ENROLLMENT: STUDENT_PREFIX + "checkEnrollment",
  STUDENT_ADMISSION: STUDENT_PREFIX + "studentAdmission",
  UPDATE_STUDENT: STUDENT_PREFIX + "updateStudentDetails",
  DELETE_STUDENT: STUDENT_PREFIX + "deleteStudentDetails",
  DELETE_STUDENT_COURSE: STUDENT_PREFIX + "deleteStudentCourse",
  ADD_COURSE_TO_STUDENT: STUDENT_PREFIX + "addCourseToStudent",
  UPDATE_COUPON_COURSE_BATCH_DETAILS: STUDENT_PREFIX + "updateCouponCourseBatchDetails",
  REMOVE_COURSE_STUDENT: STUDENT_PREFIX + "removeCourseStudent",
  // Custom Fields APIs
  CREATE_EXTRA_FIELDS: CUSTOMER_REGISTRATION_PREFIX + "createExtraFields",
  GET_EXTRA_FIELDS: CUSTOMER_REGISTRATION_PREFIX + "getExtraFieldByFlagName",
  DELETE_EXTRA_FIELD: CUSTOMER_REGISTRATION_PREFIX + "deleteExtraField",
};

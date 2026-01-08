import { ENQUIRY_PREFIX } from "../../constants";

export const uploadFormsUrls = {
  FETCH_FORM_TEMPLATE: ENQUIRY_PREFIX + "getBulkFormTemplates",
  DELETE_BULK_DATA: ENQUIRY_PREFIX + "deleteBulkData",
  FETCH_BULK_DATA: ENQUIRY_PREFIX + "getFormBulkData",
  FETCH_BULK_FORM_DETAILS: ENQUIRY_PREFIX + "getSingleFormBulkData",
  UPDATE_SINGLE_BULK_FORM: ENQUIRY_PREFIX + "updateBulkData",
  FETCH_BULK_DATA_LIST: ENQUIRY_PREFIX + "getAllLeadsMobile", 
};

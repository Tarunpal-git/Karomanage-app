import { ENQUIRY_PREFIX } from "../../constants";

export const enquiryUrls = {
  FETCH_ENQUIRY_LIST: ENQUIRY_PREFIX + "getAllEnquiryStudentList",
  GENERATE_ENQUIRY: ENQUIRY_PREFIX + "StudentEnquiryForm",
  CAPTCHA_RESPONSE: ENQUIRY_PREFIX + "captchaResponse",
  FETCH_ENQUIRY_DETAILS: ENQUIRY_PREFIX + "getSingleStudentDetail",
  UPDATE_ENQUIRY_DATA: ENQUIRY_PREFIX + "updateEnquiryStudent",
  UPDATE_FOLLOW_UP: ENQUIRY_PREFIX + "updateFollowUp",
  UPDATE_LEAD_MANAGER: ENQUIRY_PREFIX + "updateLeadManager",

  // Forms
  FETCH_FORMS_TEMPLATE_LIST: ENQUIRY_PREFIX + "getAllFormTemplateList",
  FETCH_FORM_TEMPLATE_DETAILS: ENQUIRY_PREFIX + "singleFormTemplate",
  UPDATE_FORM_TEMPLATE_STATUS: ENQUIRY_PREFIX + "deleteFormTemplate",
  UPDATE_FORM_TEMPLATE: ENQUIRY_PREFIX + "updateFormTemplate",
  

  // Form enquiries
  FETCH_FORM_ENQUIRIES: ENQUIRY_PREFIX + "getFormList",
  UPDATE_FORM_ENQUIRY: ENQUIRY_PREFIX + "updateForm",
  FETCH_FORM_ENQUIRY_DETAILS: ENQUIRY_PREFIX + "getSingleFormList",
 

  
  
  // Status
  GET_STATUS: ENQUIRY_PREFIX + "getStatus",
};

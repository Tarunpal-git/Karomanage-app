import { EMPLOYEES_PREFIX } from "../../constants";

export const employeeUrls = {
  FETCH_EMPLOYEES_LIST: EMPLOYEES_PREFIX + "getAllEmployeeList",
  FETCH_EMPLOYEE_DETAILS: EMPLOYEES_PREFIX + "getEmployeeDetails",
  LIST_ALL_EMPLOYEES: EMPLOYEES_PREFIX + "listAllEmployees",
  LIST_EMPLOYEE_PROFILE: "https://karomanage-prod-apim.azure-api.net/college-fnp-prod/listEmployeeProfile",
  CREATE_EMPLOYEE: EMPLOYEES_PREFIX + "createEmployee",
  LIST_SALARY: EMPLOYEES_PREFIX + "listSalary",
  SINGLE_SALARY: EMPLOYEES_PREFIX + "singleSalary", 
};

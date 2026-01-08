import moment from "moment";
import { store } from "../../../../app/store";

export const getSalaryMailDetails = (
  salaryDetails: TSalaryRecord,
  employeeDetails: TEmployeeData
) => {
  const organization = store.getState().organization.organization;
  const {
    customerId,
    organizationId,
    employeeBankDetails,
    employeeCode,
    employeePersonalDetails,
    employeeId,
  } = employeeDetails;
  return {
    employeeSalaryDate:
      moment(salaryDetails.dateCreated).format("DD/MM/YYYY") ?? "",
    employeeSalaryEmployeeAccountName:
      employeeBankDetails.employeeBankName ?? "",
    employeeSalaryEmployeeAccountNo:
      employeeBankDetails.employeeAccountNo ?? "",
    employeeSalaryEmployeeCode: employeeCode ?? "",
    employeeSalaryEmployeeCustomerId: customerId ?? "",
    employeeSalaryEmployeeOrganiationId: organizationId ?? "",
    employeeSalaryEmployeeDepartment:
      employeePersonalDetails.employeeDepartment ?? "",
    employeeSalaryEmployeeDesignation:
      employeePersonalDetails.employeeDesignation ?? "",
    employeeSalaryEmployeeEmail: employeePersonalDetails.employeeEmail ?? "",
    employeeSalaryEmployeeId: employeeId ?? "",
    employeeSalaryEmployeeName: `${employeePersonalDetails.employeeFirstname} ${
      employeePersonalDetails.employeeLastname ?? ""
    }`,
    employeeSalaryFlatDeduction: salaryDetails.totalDeductionFromSalary ?? "",
    employeeSalaryFlatInhandSalary: salaryDetails.totalInhandSalary ?? "",
    employeeSalaryFlatSalary: salaryDetails.promisedFixedSalary ?? "",
    employeeSalaryId: salaryDetails.salaryId ?? "",
    employeeSalaryPurpose: "mail",
    employeeSalaryOrganizationEmail: organization.organizationEmail ?? "",
    employeeSalaryOrganizationName: organization.organizationName ?? "",
    employeeSalaryOrganizationLogo: "",
    employeeSalaryPercentageDeduction:
      salaryDetails.percentageSalaryDeduction ?? "",
    employeeSalaryPercentageInhandSalary:
      salaryDetails.percentageInhandSalary ?? "",
    employeeSalaryPercentageSalary:
      salaryDetails.promisedPercentageSalary ?? "",
    employeeSalaryTotalDeduction: salaryDetails.totalDeductionFromSalary ?? "",
    employeeSalaryTotalInhandSalary: salaryDetails.totalInhandSalary ?? "",
    employeeSalaryTotalSalary: salaryDetails.totalSalary ?? "",
    employeeSalaryWorkingDays: salaryDetails.totalWorkingDays ?? "",
    employeeSalaryWorkingDaysFlat: salaryDetails.payableDays ?? "",
    employeeSalaryWorkingDaysPercentage: salaryDetails.lossOfDays ?? "",
  };
};

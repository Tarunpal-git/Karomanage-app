import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

type TData = {
  employeeSalary: {
    employeeSalaryEmployeeCustomerId: string;
    employeeSalaryEmployeeOrganiationId: string;
    employeeSalaryId: string;
    employeeSalaryOrganizationName: string;
    employeeSalaryOrganizationLogo: string;
    employeeSalaryEmployeeId: string;
    employeeSalaryFlatSalary: string;
    employeeSalaryPercentageSalary: number;
    employeeSalaryFlatInhandSalary: number;
    employeeSalaryPercentageInhandSalary: number;
    employeeSalaryFlatDeduction: string;
    employeeSalaryPercentageDeduction: string;
    employeeSalaryTotalDeduction: string;
    employeeSalaryTotalInhandSalary: number;
    employeeSalaryTotalSalary: number;
    employeeSalaryWorkingDaysFlat: number;
    employeeSalaryWorkingDaysPercentage: number;
    employeeSalaryWorkingDays: number;
    employeeSalaryEmployeeDesignation: string;
    employeeSalaryOrganizationEmail: string;
    employeeSalaryEmployeeEmail: string;
    employeeSalaryEmployeeName: string;
    employeeSalaryEmployeeCode: string;
    employeeSalaryEmployeeDepartment: string;
    employeeSalaryEmployeeAccountNo: string;
    employeeSalaryEmployeeAccountName: string;
    employeeSalaryPurpose: string;
    employeeSalaryDate: string;
  };
};

const send = async (data: TData) => {
  const response = await request({
    url: apiUrls.emailServiceUrl.INVOKE_MAIL,
    method: "POST",
    data: {
      employeeSalary: data.employeeSalary,
      action: "employeeSalary",
    },
  });
  return response;
};

export const useSendMailSalaryMutation = () => {
  return useMutation({ mutationFn: send });
};

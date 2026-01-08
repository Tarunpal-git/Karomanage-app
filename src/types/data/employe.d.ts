type TEmployeePersonalDetails = {
  employeeFirstname: string;
  employeeLastname: string;
  employeeEmail: string;
  employeePhoneNumber: string;
  employeeGurdianName: string;
  employeeGurdianContactNumber: string;
  employeeAddress: string;
  employeeDateOfBirth: string;
  employeeDepartment: string;
  employeeDesignation: string;
};

type TEmployeeProfessionalDetails = {
  employeeHighSchoolName: string;
  employeeHighSchoolBoard: string;
  employeeHighSchoolAddress: string;
  employeeHighSchoolPercentage: string;
  employeeHigherSecondarySchoolName: string;
  employeeHigherSecondarySchoolBoard: string;
  employeeHigherSecondarySchoolAddress: string;
  employeeHigherSecondarySchoolPercentage: string;
  employeeUnderGraduationCollegeName: string;
  employeeUnderGraduationCollegeCourseName: string;
  employeeUnderGraduationCollegeAddress: string;
  employeeUnderGraduationCollegePercentage: string;
  employeePostGraduationCollegeName: string;
  employeePostGraduationCollegeCourseName: string;
  employeePostGraduationCollegeAddress: string;
  employeePostGraduationCollegePercentage: string;
  referedBy: string;
  dateOfJoining: string;
  employeeSkills: string;
  releventExperienceYear: string;
};

type TEmployeeBankDetails = {
  employeeBankName: string;
  employeeAccountNo: string;
  employeeIfsceCode: string;
};

type TSalaryRecord = {
  salaryId: string;
  salarytype: string;
  lossOfDays: number;
  payableDays: number;
  promisedFixedSalary: string;
  promisedPercentageSalary: number;
  fixedInhandSalary: string;
  percentageInhandSalary: number;
  fixedSalaryDeduction: string;
  percentageSalaryDeduction: string;
  totalDeductionFromSalary: string;
  totalInhandSalary: number;
  totalSalary: number;
  totalWorkingDays: number;
  dateCreated: string;
  lastModified: string;
};

type TExpenseCategoryData = {
  categoryId: string;
};

type TExpense = {
  expenseId: string;
  expenseName: string;
  expenseCategoryData: TExpenseCategoryData[];
  expensePaymentStatus: string;
  expenseDescription: string;
  expenseAmount: string | number;
  expenseMode?: string;
  currencyCode: string;
  dateCreated: number;
};

type TSalaryHistory = {
  batchPercentageSalaryValue: string;
  dateCreated: number;
  salaryTypeId: string;
  salaryStatus: string;
};

type TBatchDetails = {
  batchId: string;
  batchStatus: string;
  salaryHistory: TSalaryHistory[];
};

type TPercentageSalary = {
  batchDetails: TBatchDetails[];
};

type TSalaryType = {
  fixedSalary: any[];
  percentageSalary: TPercentageSalary[];
};

type TEmployeeSalaryDetails = {
  type: string;
  salaryType: TSalaryType;
  dateCreated: number;
  lastModified: number;
  employeeSalaryId: string;
};

type TEmployeeData = {
  customerId: string;
  employeeId: string;
  organizationId: string;
  employeeType: string;
  employeeCode: string;
  employeePersonalDetails: TEmployeePersonalDetails;
  employeeProfessionalDetails: TEmployeeProfessionalDetails;
  employeeBankDetails: TEmployeeBankDetails;
  employeeStatus: string;
  salaryRecord: TSalaryRecord[];
  expense: TExpense[];
  fixedAndPercentage: boolean;
  employeeSalaryDetails: TEmployeeSalaryDetails[];
  id: string;
};

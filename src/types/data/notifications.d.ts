/* eslint-disable @typescript-eslint/no-explicit-any */

type TBirthdays = {
  employeeCode: string;
  employeeDateOfBirth: string;
  employeeDesignation: string;
  employeeEmail: string;
  employeeFirstname: string;
  employeeId: string;
  employeeLastname: string;
  employeePhoneNumber: string;
  isClicked: boolean;
  type: string;
  rollNo: string;
  studentContact: string;
  studentDateOfBirth: string;
  studentEmail: string;
  studentEnrollmentNumber: string;
  studentFirstName: string;
  studentLastName: string;
  studentStatus: string;
};

type TNotificationForecast = {
  studentName: string;
  rollNo: string;
  studentEmail: string;
  studentCourse: string;
  studentContact: string;
  studentStatus: string;
  upcomingForecast: number;
  isClicked: boolean;
};

type TNotificationOverdue = {
  studentName: string;
  rollNo: string;
  studentEmail: string;
  studentCourse: string;
  studentContact: string;
  studentStatus: string;
  totalDuePayment: number;
  totalReceivedPayment: number;
  allPaymentStatus: string;
  overDue: number;
  isClicked: boolean;
};

type TNotificationFollowUp = {
  leads: any[];
  bulkData: any[];
  type?: string; //updated
};
type TNotificationFollowUps = {
  name: string; // Updated to lowercase
  followUpDate: string; // Updated to lowercase
  message: string; // Updated to lowercase
  isClicked: boolean;
  formId: string;
  formTemplateId: string;
};

type TNotificationOverDueFollowUp = {
  bulkData: any[];
  leads: any[];
};

type TNotificationUpcomingPayments = {
  leads: any[];
  bulkData: any[];
}

type TNotificationLeads = {
  followUp: TNotificationFollowUp;
  overDueFollowUp: TNotificationOverDueFollowUp;
  upcomingPayments: TNotificationUpcomingPayments;
};

type TNotificationDetails = {
  birthdays: {
    employee: TBirthdays[];
    student: TBirthdays[];
  };
  overDue: TNotificationOverdue[];
  upcomingForecast: TNotificationForecast[];
  leads: TNotificationLeads;
};


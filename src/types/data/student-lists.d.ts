type TStudentBatch = {
  batchId: string;
  courseId: string;
};

type TAnnouncementData = {
  campaignName: string;
  campaignId: string;
  dateCreated: number;
  medium: "email" | "whatsapp";
};

type TInstallmentDetails = {
  installmentId: string;
  installmentNumber: number;
  paymentStatus: string;
  paymentReceiveDate?: string;
  formatedPaymentReceiveDate?: string;
  receivedPayment?: number;
  paymentNotes: string;
  nextpaymentDate?: string;
  formatedNextpaymentDate?: string;
  duePayment?: number;
};

type TPaymentDetails = {
  isPartPayment: boolean;
  totalPayment: number;
  refundAmount: number;
  discountedPaymentAmount: number;
  totalDuePayment: number;
  totalReceivedPayment: number;
  coursePaymentStatus: string;
  installmentDetails: TInstallmentDetails[];
};

type TCourse = {
  includes(courseId: string): unknown;
  courseId: string;
  paymentDetails: TPaymentDetails;
};

type TAllPaymentDetails = {
  grandTotalPaymentAmount: number;
  grandRefundAmount: number;
  totalDuePayment: number;
  totalReceivedPayment: number;
  allPaymentStatus: string;
};

type TStudentList = {
  customerId: string;
  studentEnrollmentNumber: string;
  studentStatus: string;
  organizationId: string;
  rollNo: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentCourse: string;
  studentCollage: string;
  studentSemester: string;
  announcements: TAnnouncementData[];
  studentContact: string;
  studentFatherName: string;
  studentFatherContact: string;
  studentAddress: string;
  studentDepartmentName: string;
  studentDateOfBirth: string | null;
  batch: TStudentBatch[];
  courses: TCourse[];
  coupon: any[];
  allPaymentDetails: TAllPaymentDetails;
  refundList: any[];
  referedBy: string;
  dateCreated: number;
};

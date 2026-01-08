type TForecastPaymentDetails = {
  installmentId: string;
  installmentNumber: number;
  paymentStatus: "due" | "paid";
  paymentNotes: string;
  duePayment: number;
  nextpaymentDate: string;
  courseId: string;
};

type TPaymentForecastDetails = {
  Details: TForecastPaymentDetails;
};

type TPaymentForecast = {
  studentFirstName: string;
  studentLastName?: string;
  rollNo: string;
  studentEmail: string;
  studentCourse: string;
  studentContact: string;
  studentStatus: "active" | "inactive";
  paymentForecast: TPaymentForecastDetails[];
};

type TReceivedForecastPaymentDetails = {
  courseId: string;
  installmentNumber: number;
  paymentStatus: "due" | "paid";
  paymentNotes: string;
  receivedPayment: number;
  paymentReceiveDate: string;
};

type TReceivedPaymentForecastDetails = {
  Details: TReceivedForecastPaymentDetails;
};

type TReceivedPaymentForecast = {
  studentFirstName: string;
  studentLastName?: string;
  rollNo: string;
  studentEmail: string;
  studentCourse: string;
  studentContact: string;
  studentStatus: "active" | "inactive";
  paymentForecast: TReceivedPaymentForecastDetails[];
};
